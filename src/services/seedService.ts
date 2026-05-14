import { businessService } from './businessService';
import { inventoryService } from './inventoryService';
import { supabase } from '@/lib/supabase';
import { mockProducts } from '@/constants/mockData';

export const seedService = {
  async seedDemoData(userId: string, email: string) {
    try {
      // 1. Create a business
      const business = await businessService.createBusiness('OmniBiz Demo Shop', 'Coffee & Style');

      // 2. Create a main branch
      const branch = await businessService.createBranch(business.id, 'Main Street', true);

      // 3. Update current user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          business_id: business.id,
          branch_id: branch.id,
          role: 'owner',
          full_name: email.split('@')[0]
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // 4. Seed products and services
      for (const item of mockProducts) {
        if (item.category === 'Service') {
          await inventoryService.createService({
            business_id: business.id,
            name: item.name,
            price: item.price,
            duration_minutes: 30, // default
            category: item.category,
            is_active: true
          });
        } else {
          await inventoryService.createProduct({
            business_id: business.id,
            name: item.name,
            selling_price: item.price,
            cost_price: item.price * 0.5,
            stock_quantity: item.stock_quantity,
            sku: item.sku,
            category: item.category,
            is_active: true
          });
        }
      }

      return { business, branch };
    } catch (error) {
      console.error('Seeding error:', error);
      throw error;
    }
  }
};
