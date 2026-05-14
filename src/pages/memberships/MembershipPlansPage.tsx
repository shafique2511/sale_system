import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Check, 
  Layers, 
  Clock, 
  DollarSign, 
  Settings,
  MoreVertical
} from 'lucide-react';

const mockPlans = [
  { 
    id: '1', 
    name: 'Gold VIP', 
    price: 99, 
    duration: 'Monthly', 
    visits: 'Unlimited', 
    discount: 15, 
    benefits: ['Priority Booking', 'Free Drink every visit', '15% Off Products'],
    active: true,
    color: 'bg-amber-500/10 border-amber-500/20 text-amber-500'
  },
  { 
    id: '2', 
    name: 'Monthly Pass', 
    price: 49, 
    duration: 'Monthly', 
    visits: '4 Visits', 
    discount: 5, 
    benefits: ['4 Haircuts/month', '5% Off Products'],
    active: true,
    color: 'bg-blue-500/10 border-blue-500/20 text-blue-500'
  },
  { 
    id: '3', 
    name: 'Platinum Annual', 
    price: 899, 
    duration: 'Yearly', 
    visits: 'Unlimited', 
    discount: 25, 
    benefits: ['Full Access', 'All Services Included', '25% Off Products', 'Guest Pass'],
    active: true,
    color: 'bg-purple-500/10 border-purple-500/20 text-purple-500'
  },
];

export const MembershipPlansPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Membership Plans</h1>
          <p className="text-muted-foreground">Define your subscription and package offerings.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPlans.map((plan) => (
          <Card key={plan.id} className="relative flex flex-col hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className={plan.color}>
                  {plan.active ? 'Active' : 'Inactive'}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {plan.duration} Subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground text-sm">/{plan.duration.toLowerCase()}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1 bg-primary/10 rounded-full text-primary">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{plan.visits} Service Hits</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1 bg-primary/10 rounded-full text-primary">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{plan.discount}% Discount on items</span>
                </div>
                {plan.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="p-1 bg-muted rounded-full">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
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
