import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';

import { DashboardPage } from './pages/dashboard/DashboardPage';
import { POSPage } from './pages/pos/POSPage';
import { BookingsPage } from './pages/bookings/BookingsPage';
import { CalendarPage } from './pages/bookings/CalendarPage';
import { CustomersPage } from './pages/customers/CustomersPage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { StaffPage } from './pages/staff/StaffPage';
import { MembershipPlansPage } from './pages/memberships/MembershipPlansPage';
import { MembersPage } from './pages/memberships/MembersPage';
import { LoyaltyPage } from './pages/loyalty/LoyaltyPage';
import { RewardsPage } from './pages/loyalty/RewardsPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProductsPage } from './pages/inventory/ProductsPage';
import { PaymentsPage } from './pages/payments/PaymentsPage';
import { CommissionPage } from './pages/commission/CommissionPage';
import { MarketingPage } from './pages/marketing/MarketingPage';
import { BranchesPage } from './pages/branches/BranchesPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { LicensePage } from './pages/settings/LicensePage';
import { PortalLayout } from './pages/customer-portal/PortalLayout';
import { PortalHome } from './pages/customer-portal/PortalHome';
import { PortalBookPage } from './pages/customer-portal/PortalBookPage';
import { PortalBookingsPage } from './pages/customer-portal/PortalBookingsPage';
import { PortalMembershipPage } from './pages/customer-portal/PortalMembershipPage';
import { PortalRewardsPage } from './pages/customer-portal/PortalRewardsPage';
import { PortalProfilePage } from './pages/customer-portal/PortalProfilePage';
import { OmniAssistant } from './components/assistant/OmniAssistant';

// Placeholder components

export default function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/membership-plans" element={<MembershipPlansPage />} />
              <Route path="/pos" element={<POSPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/commission" element={<CommissionPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/loyalty" element={<LoyaltyPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/marketing" element={<MarketingPage />} />
              <Route path="/branches" element={<BranchesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/license" element={<LicensePage />} />
            </Route>

            <Route path="/portal/:businessId" element={<PortalLayout />}>
              <Route index element={<PortalHome />} />
              <Route path="book" element={<PortalBookPage />} />
              <Route path="bookings" element={<PortalBookingsPage />} />
              <Route path="membership" element={<PortalMembershipPage />} />
              <Route path="rewards" element={<PortalRewardsPage />} />
              <Route path="profile" element={<PortalProfilePage />} />
            </Route>

          </Routes>
          <Toaster position="top-right" />
          <OmniAssistant />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  );
}
