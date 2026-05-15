import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Gift, 
  Star, 
  TrendingUp, 
  Clock, 
  Coffee, 
  Scissors,
  Lock,
  ArrowRight,
  Loader2,
  Tag,
  Sparkles
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useParams } from 'react-router-dom';
import { loyaltyService, LoyaltyReward } from '@/services/loyaltyService';
import { customerService } from '@/services/customerService';
import { portalService } from '@/services/portalService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const PortalRewardsPage = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId) return;
      setLoading(true);
      try {
        const [customers, rewardsData] = await Promise.all([
          customerService.getCustomers(businessId),
          loyaltyService.getRewards(businessId)
        ]);
        
        if (customers.length > 0) {
          setCustomer(customers[0]);
        }
        setRewards(rewardsData);
      } catch (error) {
        toast.error('Failed to load rewards');
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

  const currentPoints = customer?.points || 0;
  const nextReward = rewards.find(r => r.point_cost > currentPoints) || rewards[rewards.length - 1];

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'Product': return Tag;
      case 'Service': return Scissors;
      case 'Custom': return Gift;
      default: return Star;
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'Product': return 'bg-amber-500';
      case 'Service': return 'bg-blue-500';
      case 'Custom': return 'bg-pink-500';
      default: return 'bg-indigo-600';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Rewards</h1>
        <p className="text-muted-foreground">Redeem your points for exclusive products and services.</p>
      </div>

      {/* Points Summary Hero */}
      <Card className="bg-primary text-primary-foreground relative overflow-hidden rounded-[2rem] border-0 shadow-xl">
        <div className="absolute -right-20 -top-20 opacity-10">
          <Gift className="h-80 w-80 rotate-12" />
        </div>
        <CardContent className="p-10 relative z-10">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-4 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-white" /> Loyalty Status: Active
                 </div>
                 <h2 className="text-5xl font-extrabold tracking-tight">{currentPoints.toLocaleString()}</h2>
                 <p className="text-lg opacity-80 uppercase tracking-widest font-medium">Points Balance</p>
              </div>
              
              {nextReward && (
                <div className="w-full md:w-64 space-y-4">
                   <div className="flex justify-between text-sm font-bold uppercase tracking-widest opacity-80 mb-1">
                      <span>Next Reward</span>
                      <span>{currentPoints} / {nextReward.point_cost}</span>
                   </div>
                   <Progress value={Math.min((currentPoints / nextReward.point_cost) * 100, 100)} className="h-3 bg-white/20" />
                   <p className="text-[10px] text-center opacity-60">
                     You are {Math.max(nextReward.point_cost - currentPoints, 0)} points away from {nextReward.name}!
                   </p>
                </div>
              )}
           </div>
        </CardContent>
      </Card>

      {/* Availability Filters */}
      <div className="flex gap-2">
         <Badge className="px-4 py-1.5 rounded-full cursor-pointer">All Rewards</Badge>
         <Badge variant="outline" className="px-4 py-1.5 rounded-full cursor-pointer hover:bg-muted">My Vouchers</Badge>
         <Badge variant="outline" className="px-4 py-1.5 rounded-full cursor-pointer hover:bg-muted">Earn Points</Badge>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {rewards.map((reward, i) => {
           const isAvailable = currentPoints >= reward.point_cost;
           const Icon = getRewardIcon(reward.reward_type);
           const color = getRewardColor(reward.reward_type);
           
           return (
            <Card key={reward.id} className={cn(
              "relative overflow-hidden transition-all duration-300",
              isAvailable ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : "opacity-75 grayscale"
            )}>
               <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                     <div className="flex items-center gap-4">
                        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
                           <Icon className="h-6 w-6" />
                        </div>
                        <div>
                           <h3 className="font-bold">{reward.name}</h3>
                           <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                              <Clock className="h-3 w-3" /> {reward.is_active ? 'Available' : 'Expired'}
                           </div>
                        </div>
                     </div>
                     {isAvailable ? (
                        <Badge variant="secondary" className="bg-primary/10 text-primary font-bold border-primary/20">
                           {reward.point_cost} PTS
                        </Badge>
                     ) : (
                        <div className="flex flex-col items-end gap-1">
                           <Lock className="h-4 w-4 text-muted-foreground" />
                           <span className="text-[10px] font-bold text-muted-foreground">{reward.point_cost} PTS</span>
                        </div>
                     )}
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                     <div className="space-y-1">
                        {!isAvailable && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                             <Progress value={(currentPoints / reward.point_cost) * 100} className="h-1 w-20" />
                             <span>{Math.round((currentPoints / reward.point_cost) * 100)}% there</span>
                          </div>
                        )}
                     </div>
                     <Button variant={isAvailable ? "default" : "outline"} size="sm" disabled={!isAvailable} className="gap-2">
                        {isAvailable ? "Redeem Now" : "Locked"}
                        <ArrowRight className="h-3 w-3" />
                     </Button>
                  </div>
               </CardContent>
            </Card>
           );
         })}
      </div>

      {/* History */}
      <div className="space-y-4 pt-4">
         <h2 className="font-bold text-xl px-1">Recent Activity</h2>
         <Card>
            <CardContent className="p-0">
               {[
                 { action: 'Welcome Bonus', pts: '+100', date: 'Account Created' },
                 { action: 'Visit Points', pts: '+50', date: 'Recently' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-primary" />
                       </div>
                       <div>
                          <p className="text-sm font-bold">{item.action}</p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                       </div>
                    </div>
                    <span className={cn("font-bold", item.pts.startsWith('+') ? "text-green-600" : "text-red-500")}>
                       {item.pts}
                    </span>
                 </div>
               ))}
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

