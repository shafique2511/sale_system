import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Check, 
  Clock, 
  Settings,
  MoreVertical,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { membershipService, MembershipPlan } from '@/services/membershipService';
import { toast } from 'sonner';

export const MembershipPlansPage = () => {
  const { businessId } = useAuth();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await membershipService.getPlans(businessId);
      setPlans(data);
    } catch (error) {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [businessId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Membership Plans</h1>
          <p className="text-muted-foreground">Define your subscription and package offerings.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative flex flex-col hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className={plan.is_active ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : ''}>
                  {plan.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> <span className="capitalize">{plan.duration_type}</span> Subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground text-sm">/{plan.duration_type}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1 bg-primary/10 rounded-full text-primary">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{plan.service_limit ?? 'Unlimited'} Service Hits</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1 bg-primary/10 rounded-full text-primary">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{plan.discount_percentage}% Discount on items</span>
                </div>
                {plan.description && (
                  <p className="text-sm text-muted-foreground pt-2 border-t">
                    {plan.description}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t bg-muted/20">
              <Button variant="outline" className="w-full gap-2">
                <Settings className="h-4 w-4" />
                Manage Plan
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {plans.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <p>No membership plans found. Create one to start accepting memberships!</p>
          </div>
        )}

        <button className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-12 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-accent transition-all group text-muted-foreground hover:text-primary">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10">
            <Plus className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="font-bold">Add New Offering</p>
            <p className="text-sm">Click to create a membership Tier</p>
          </div>
        </button>
      </div>
    </div>
  );
};

