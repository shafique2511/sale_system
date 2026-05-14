import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Check, 
  Crown, 
  ArrowRight,
  TrendingUp,
  Store,
  Loader2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useParams } from 'react-router-dom';
import { membershipService, MembershipPlan, UserMembership } from '@/services/membershipService';
import { customerService } from '@/services/customerService';
import { portalService } from '@/services/portalService';
import { toast } from 'sonner';

export const PortalMembershipPage = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [loading, setLoading] = useState(true);
  const [activeMembership, setActiveMembership] = useState<UserMembership | null>(null);
  const [availablePlans, setAvailablePlans] = useState<MembershipPlan[]>([]);
  const [businessName, setBusinessName] = useState('');
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId) return;
      setLoading(true);
      try {
        const [biz, customers, plans] = await Promise.all([
          portalService.getBusinessInfo(businessId),
          customerService.getCustomers(businessId),
          membershipService.getPlans(businessId)
        ]);

        setBusinessName(biz.name);
        setAvailablePlans(plans);
        
        if (customers.length > 0) {
          const firstCustomer = customers[0];
          setCustomer(firstCustomer);
          const members = await membershipService.getActiveMemberships(businessId);
          const myMembership = members.find(m => m.customer_id === firstCustomer.id);
          setActiveMembership(myMembership || null);
        }
      } catch (error) {
        toast.error('Failed to load membership data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [businessId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Membership</h1>
        <p className="text-muted-foreground">Premium perks and exclusive benefits.</p>
      </div>

      {/* Active Membership Card (Hero) */}
      {activeMembership ? (
        <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-[2rem] overflow-hidden border-0 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <CreditCard className="h-64 w-64 rotate-12" />
          </div>
          <CardHeader className="p-8">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-60">{businessName} VIP</span>
              <div className="h-12 w-12 flex items-center justify-center p-2 bg-white/10 rounded-full backdrop-blur-md">
                <Store className="h-7 w-7" />
              </div>
            </div>
            <div className="mt-12">
              <h2 className="text-4xl font-light tracking-[0.2em] uppercase">{customer?.name?.toUpperCase()}</h2>
              <p className="text-white/40 font-mono mt-2 tracking-widest text-sm">ID: {activeMembership.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </CardHeader>
          <CardContent className="px-8 pt-4 pb-12 flex justify-between items-end relative z-10">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest opacity-40">Status</p>
              <div className="flex items-center gap-2">
                 <Crown className="h-5 w-5 text-amber-400 fill-amber-400" />
                 <p className="text-lg font-bold text-amber-400 tracking-wider capitalize">{activeMembership.plan?.name}</p>
              </div>
            </div>
            <div className="text-right space-y-1">
               <p className="text-[10px] uppercase tracking-widest opacity-40">Valid Until</p>
               <p className="text-lg font-bold">
                 {activeMembership.end_date ? new Date(activeMembership.end_date).toLocaleDateString(undefined, { month: '2-digit', year: 'numeric' }) : 'N/A'}
               </p>
            </div>
          </CardContent>
          <div className="h-3 bg-amber-400 absolute bottom-0 left-0 w-full" />
        </Card>
      ) : (
        <Card className="p-12 text-center border-dashed flex flex-col items-center">
           <CreditCard className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
           <h2 className="text-xl font-bold">No Active Membership</h2>
           <p className="text-muted-foreground mt-2">Join a plan to unlock exclusive benefits and discounts.</p>
        </Card>
      )}

      {/* Benefits & Usage */}
      {activeMembership && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Plan Benefits</CardTitle>
              <CardDescription>What's included in {activeMembership.plan?.name}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                `${activeMembership.plan?.discount_percentage}% Discount on items`,
                `${activeMembership.plan?.service_limit ?? 'Unlimited'} Service hits included`,
                "Priority Booking Access",
                "Exclusive Member-only Alerts"
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                   <div className="mt-1 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-600">
                      <Check className="h-2.5 w-2.5" />
                   </div>
                   <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage & Limits</CardTitle>
              <CardDescription>Allocations remaining.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                     <span className="font-medium text-muted-foreground">Service Hits</span>
                     <span className="font-bold">
                        {activeMembership.remaining_hits ?? 'Unlimited'} / {activeMembership.plan?.service_limit ?? '∞'} Left
                     </span>
                  </div>
                  <Progress 
                    value={activeMembership.remaining_hits && activeMembership.plan?.service_limit ? (activeMembership.remaining_hits / activeMembership.plan.service_limit) * 100 : 100} 
                    className="h-2" 
                  />
               </div>
               <div className="pt-4 border-t flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                     <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                     <p className="text-sm font-bold">Plan Status</p>
                     <p className="text-[10px] text-muted-foreground uppercase capitalize">{activeMembership.status}</p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upgrade Options / Available Plans */}
      <div className="space-y-4">
         <h2 className="font-bold text-xl px-1">
           {activeMembership ? 'Upgrade Your Experience' : 'Available Plans'}
         </h2>
         <div className="grid grid-cols-1 gap-4">
           {availablePlans.filter(p => p.id !== activeMembership?.plan_id).map(plan => (
             <Card key={plan.id} className="bg-primary/5 border-primary/20 relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                   <Crown className="h-40 w-40" />
                </div>
                <CardHeader>
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <Badge className="bg-indigo-600 hover:bg-indigo-700 uppercase">{plan.duration_type}</Badge>
                         <CardTitle className="text-2xl mt-2">{plan.name}</CardTitle>
                      </div>
                      <div className="text-right">
                         <p className="text-3xl font-bold">${plan.price}</p>
                         <p className="text-[10px] uppercase font-bold text-muted-foreground">Per {plan.duration_type === 'monthly' ? 'Month' : 'Year'}</p>
                      </div>
                   </div>
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-muted-foreground max-w-sm">
                      {plan.description || `Get ${plan.discount_percentage}% off and ${plan.service_limit ?? 'unlimited'} service hits.`}
                   </p>
                </CardContent>
                <CardFooter>
                   <Button className="w-full sm:w-auto gap-2 h-11 bg-indigo-600 hover:bg-indigo-700 transition-colors">
                      {activeMembership ? 'Upgrade Now' : 'Join Plan'} <ArrowRight className="h-4 w-4" />
                   </Button>
                </CardFooter>
             </Card>
           ))}
         </div>
      </div>
    </div>
  );
};

