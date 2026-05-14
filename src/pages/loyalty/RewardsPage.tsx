import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Gift, 
  Tag, 
  Coffee, 
  Scissors, 
  Star,
  Ticket,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { loyaltyService, LoyaltyReward } from '@/services/loyaltyService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const RewardsPage = () => {
  const { businessId } = useAuth();
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await loyaltyService.getRewards(businessId);
      setRewards(data);
    } catch (error) {
      toast.error('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [businessId]);

  const getRewardIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'product': return Gift;
      case 'service': return Scissors;
      case 'voucher': return Tag;
      default: return Star;
    }
  };

  const getRewardColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'product': return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
      case 'service': return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
      case 'voucher': return 'text-green-600 bg-green-500/10 border-green-500/20';
      default: return 'text-purple-600 bg-purple-500/10 border-purple-500/20';
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Reward Catalog</h1>
          <p className="text-muted-foreground">Manage the items and discounts users can redeem with points.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Reward
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rewards.map((reward) => {
          const Icon = getRewardIcon(reward.reward_type);
          const colorClass = getRewardColor(reward.reward_type);
          
          return (
            <Card key={reward.id} className="group relative flex flex-col hover:border-primary/50 transition-all overflow-hidden">
              <div className="p-12 flex items-center justify-center bg-muted/30 group-hover:bg-primary/5 transition-colors">
                <Icon className={cn("h-16 w-16 opacity-80 group-hover:scale-110 transition-transform", colorClass.split(' ')[0])} />
              </div>
              <CardHeader className="pt-4">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={cn("capitalize", colorClass)}>{reward.reward_type}</Badge>
                  <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                    <Star className="h-4 w-4 fill-amber-500" />
                    {reward.point_cost}
                  </div>
                </div>
                <CardTitle className="mt-2 text-lg">{reward.name}</CardTitle>
                <CardDescription className="text-xs line-clamp-2">{reward.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto border-t p-4 flex justify-between items-center bg-card">
                <span className="text-xs text-muted-foreground">{reward.is_active ? 'Available' : 'Inactive'}</span>
                <Button variant="ghost" size="sm" className="h-8">Configure</Button>
              </CardFooter>
            </Card>
          );
        })}

        {rewards.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No rewards in catalog yet.
          </div>
        )}

        <button className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4 hover:bg-accent transition-all min-h-[300px]">
           <Ticket className="h-12 w-12 text-muted-foreground opacity-20" />
           <p className="text-sm font-medium text-muted-foreground">Add New Reward Tier</p>
        </button>
      </div>
    </div>
  );
};

