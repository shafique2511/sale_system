import { businessService } from './businessService';
import { inventoryService } from './inventoryService';
import { supabase } from '@/lib/supabase';
import { mockProducts } from '@/constants/mockData';

export const seedService = {
  async seedDemoData(userId: string, email: string) {
    console.log('Starting seedDemoData for:', { userId, email });
    try {
      // 1. Create a business
      console.log('Creating business...');
      const business = await businessService.createBusiness('OmniBiz Demo Shop', 'Coffee & Style');
      console.log('Business created:', business.id);

      // 2. Update current user profile with business_id and owner role first
      // This is CRITICAL for RLS policies on branches, products, etc. to pass
      // Using upsert to ensure the profile exists
      console.log('Upserting user profile with business_id...');
      const { error: initialProfileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          email: email,
          business_id: business.id,
          role: 'owner',
          full_name: email.split('@')[0]
        });

      if (initialProfileError) {
        console.error('Initial profile error:', initialProfileError);
        throw initialProfileError;
      }
      console.log('Profile upserted successfully');

      // 3. Create a main branch
      console.log('Creating main branch...');
      const branch = await businessService.createBranch(business.id, 'Main Street', true);
      console.log('Branch created:', branch.id);

      // 4. Update profile with branch_id
      const { error: finalProfileError } = await supabase
        .from('user_profiles')
        .update({ branch_id: branch.id })
        .eq('id', userId);

      if (finalProfileError) {
        console.error('Final profile error:', finalProfileError);
        throw finalProfileError;
      }
      console.log('Profile updated with branch_id successfully');

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
