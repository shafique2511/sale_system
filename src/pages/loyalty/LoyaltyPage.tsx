import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Settings, 
  Plus, 
  Gift, 
  Star,
  Users,
  TrendingUp,
  Coins
} from 'lucide-react';
import { mockCustomers } from '@/constants/mockData';

export const LoyaltyPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <Trophy className="h-8 w-8" />
            Loyalty Program
          </h1>
          <p className="text-muted-foreground">Configure point accumulation rules and track customer rewards.</p>
        </div>
        <Button className="gap-2">
          <Settings className="h-4 w-4" />
          Program Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              Earning Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10 Points</div>
            <p className="text-xs text-muted-foreground mt-1">for every $1.00 spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Active Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground mt-1">customers with points</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
              <Gift className="h-4 w-4 text-purple-500" />
              Claimed Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,402</div>
            <p className="text-xs text-muted-foreground mt-1">vouchers redeemed life-time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Point Earners</CardTitle>
            <CardDescription>Customers with the highest loyalty balance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCustomers.sort((a,b) => b.points - a.points).map((customer, i) => (
                <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-4">{i+1}</span>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                      {customer.name.charAt(0)}
                    </div>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{customer.points}</span>
                    <Coins className="h-3 w-3 text-amber-500" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Points Distribution Rules</CardTitle>
            <CardDescription>Manage how points are automatically awarded.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border-2 border-dashed">
              <div className="space-y-1">
                <p className="text-sm font-bold">Birthday Bonus</p>
                <p className="text-xs text-muted-foreground">Points awarded automatically on birthday.</p>
              </div>
              <Badge className="bg-amber-500 font-bold">500 pts</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border-2 border-dashed">
              <div className="space-y-1">
                <p className="text-sm font-bold">Referral Success</p>
                <p className="text-xs text-muted-foreground">Points for both referrer and referee.</p>
              </div>
              <Badge className="bg-blue-500 font-bold">1000 pts</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border-2 border-dashed opacity-60">
              <div className="space-y-1">
                <p className="text-sm font-bold">First Visit</p>
                <p className="text-xs text-muted-foreground">Welcome points for new customers.</p>
              </div>
              <Badge variant="outline">Disabled</Badge>
            </div>
            <Button className="w-full gap-2 mt-2">
              <Plus className="h-4 w-4" />
              Add Custom Rule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
