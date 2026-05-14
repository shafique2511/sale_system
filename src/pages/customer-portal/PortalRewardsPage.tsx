import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Gift, 
  Sparkles, 
  Star, 
  TrendingUp, 
  Clock, 
  Coffee, 
  Scissors,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const PortalRewardsPage = () => {
  const currentPoints = 1250;
  
  const rewards = [
    { name: 'Free Premium Coffee', points: 300, icon: Coffee, color: 'bg-amber-500', available: true },
    { name: '10% Service Discount', points: 500, icon: Scissors, color: 'bg-blue-500', available: true },
    { name: 'Free Product Sample', points: 800, icon: Gift, color: 'bg-pink-500', available: true },
    { name: 'Free Full Service', points: 2500, icon: Sparkles, color: 'bg-indigo-600', available: false },
  ];

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
                    <Star className="h-3 w-3 fill-white" /> Loyalty Level: Gold
                 </div>
                 <h2 className="text-5xl font-extrabold tracking-tight">{currentPoints.toLocaleString()}</h2>
                 <p className="text-lg opacity-80 uppercase tracking-widest font-medium">Points Balance</p>
              </div>
              
              <div className="w-full md:w-64 space-y-4">
                 <div className="flex justify-between text-sm font-bold uppercase tracking-widest opacity-80 mb-1">
                    <span>Next Reward</span>
                    <span>{currentPoints} / 2500</span>
                 </div>
                 <Progress value={(currentPoints/2500)*100} className="h-3 bg-white/20" />
                 <p className="text-[10px] text-center opacity-60">You are 1,250 points away from a FREE Haircut!</p>
              </div>
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
         {rewards.map((reward, i) => (
           <Card key={i} className={cn(
             "relative overflow-hidden transition-all duration-300",
             reward.available ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : "opacity-75 grayscale"
           )}>
              <CardContent className="p-6">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                       <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg", reward.color)}>
                          <reward.icon className="h-6 w-6" />
                       </div>
                       <div>
                          <h3 className="font-bold">{reward.name}</h3>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                             <Clock className="h-3 w-3" /> Expires in 30 days
                          </div>
                       </div>
                    </div>
                    {reward.available ? (
                       <Badge variant="secondary" className="bg-primary/10 text-primary font-bold border-primary/20">
                          {reward.points} PTS
                       </Badge>
                    ) : (
                       <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                 </div>
                 
                 <div className="mt-6 flex items-center justify-between">
                    <div className="space-y-1">
                       {!reward.available && (
                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Progress value={50} className="h-1 w-20" />
                            <span>50% there</span>
                         </div>
                       )}
                    </div>
                    <Button variant={reward.available ? "default" : "outline"} size="sm" disabled={!reward.available} className="gap-2">
                       {reward.available ? "Redeem Now" : "Locked"}
                       <ArrowRight className="h-3 w-3" />
                    </Button>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      {/* History */}
      <div className="space-y-4 pt-4">
         <h2 className="font-bold text-xl px-1">Recent Activity</h2>
         <Card>
            <CardContent className="p-0">
               {[
                 { action: 'Visit Points - Main Street', pts: '+50', date: 'Yesterday' },
                 { action: 'Redeemed: Single Espresso', pts: '-300', date: '3 days ago' },
                 { action: 'Birthday Bonus', pts: '+500', date: 'May 10' },
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

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
