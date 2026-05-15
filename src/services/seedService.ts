import { businessService } from './businessService';
import { inventoryService } from './inventoryService';
import { supabase } from '@/lib/supabase';
import { mockProducts } from '@/constants/mockData';

export const seedService = {
  async seedDemoData(userId: string, email: string) {
    try {
      // 1. Create a business
      const business = await businessService.createBusiness('OmniBiz Demo Shop', 'Coffee & Style');

      // 2. Update current user profile with business_id and owner role first
      // This is CRITICAL for RLS policies on branches, products, etc. to pass
      // Using upsert to ensure the profile exists
      const { error: initialProfileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          email: email,
          business_id: business.id,
          role: 'owner',
          full_name: email.split('@')[0]
        });

      if (initialProfileError) throw initialProfileError;

      // 3. Create a main branch
      const branch = await businessService.createBranch(business.id, 'Main Street', true);

      // 4. Update profile with branch_id
      const { error: finalProfileError } = await supabase
        .from('user_profiles')
        .update({ branch_id: branch.id })
        .eq('id', userId);

      if (finalProfileError) throw finalProfileError;

      // 5. Seed products and services
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
