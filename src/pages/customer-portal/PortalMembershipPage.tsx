import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Check, 
  Zap, 
  Crown, 
  ShieldCheck, 
  Calendar,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Store
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const PortalMembershipPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Membership</h1>
        <p className="text-muted-foreground">Premium perks and exclusive benefits.</p>
      </div>

      {/* Active Membership Card (Hero) */}
      <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-[2rem] overflow-hidden border-0 shadow-2xl relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <CreditCard className="h-64 w-64 rotate-12" />
        </div>
        <CardHeader className="p-8">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-60">OmniBiz Exclusive VIP</span>
            <div className="h-12 w-12 flex items-center justify-center p-2 bg-white/10 rounded-full backdrop-blur-md">
              <Store className="h-7 w-7" />
            </div>
          </div>
          <div className="mt-12">
            <h2 className="text-4xl font-light tracking-[0.2em] uppercase">JOHN DOE</h2>
            <p className="text-white/40 font-mono mt-2 tracking-widest text-sm">ID: OMNI-7729-2026-X</p>
          </div>
        </CardHeader>
        <CardContent className="px-8 pt-4 pb-12 flex justify-between items-end relative z-10">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest opacity-40">Status</p>
            <div className="flex items-center gap-2">
               <Crown className="h-5 w-5 text-amber-400 fill-amber-400" />
               <p className="text-lg font-bold text-amber-400 tracking-wider">GOLD ELITE</p>
            </div>
          </div>
          <div className="text-right space-y-1">
             <p className="text-[10px] uppercase tracking-widest opacity-40">Valid Until</p>
             <p className="text-lg font-bold">12 / 2026</p>
          </div>
        </CardContent>
        <div className="h-3 bg-amber-400 absolute bottom-0 left-0 w-full" />
      </Card>

      {/* Benefits & Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Plan Benefits</CardTitle>
            <CardDescription>What's included in Gold Elite.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "15% Discount on all services",
              "1 Free Premium Coffee per visit",
              "Priority Booking Access",
              "Exclusive Member-only Events",
              "Unlimited High-Speed WiFi"
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
            <CardDescription>Monthly allocations remaining.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                   <span className="font-medium text-muted-foreground">Free Services</span>
                   <span className="font-bold">2 / 4 Left</span>
                </div>
                <Progress value={50} className="h-2" />
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                   <span className="font-medium text-muted-foreground">Coffee Rewards</span>
                   <span className="font-bold">12 / 15 Left</span>
                </div>
                <Progress value={80} className="h-2" />
             </div>
             <div className="pt-4 border-t flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                   <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-sm font-bold">Renewal Coming Up</p>
                   <p className="text-[10px] text-muted-foreground">Auto-renewal on June 14, 2026</p>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Options */}
      <div className="space-y-4">
         <h2 className="font-bold text-xl px-1">Upgrade Your Experience</h2>
         <Card className="bg-primary/5 border-primary/20 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
               <Crown className="h-40 w-40" />
            </div>
            <CardHeader>
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                     <Badge className="bg-indigo-600 hover:bg-indigo-700">PLATINUM LEVEL</Badge>
                     <CardTitle className="text-2xl mt-2">Become a Platinum Member</CardTitle>
                  </div>
                  <div className="text-right">
                     <p className="text-3xl font-bold">$129</p>
                     <p className="text-[10px] uppercase font-bold text-muted-foreground">Per Month</p>
                  </div>
               </div>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground max-w-sm">
                  Get everything in Gold, plus unlimited standard services, personal locker, and 25% off all retail products.
               </p>
            </CardContent>
            <CardFooter>
               <Button className="w-full sm:w-auto gap-2 h-11 bg-indigo-600 hover:bg-indigo-700 transition-colors">
                  Upgrade Now <ArrowRight className="h-4 w-4" />
               </Button>
            </CardFooter>
         </Card>
      </div>
    </div>
  );
};
