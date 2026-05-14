import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Megaphone, 
  Mail, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Users, 
  Calendar,
  Sparkles,
  ArrowRight,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const MarketingPage = () => {
  const campaigns = [
    { name: 'Summer Splendor', type: 'Email', status: 'Active', reach: '2,400', conv: '4.5%', color: 'bg-blue-500' },
    { name: 'VIP Weekend', type: 'SMS', status: 'Draft', reach: '-', conv: '-', color: 'bg-amber-500' },
    { name: 'Re-engagement', type: 'Email', status: 'Completed', reach: '1,250', conv: '8.2%', color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Center</h1>
          <p className="text-muted-foreground">Engage your customers with targeted campaigns and promotions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Target className="h-4 w-4" />
            Audience Segments
          </Button>
          <Button className="gap-2">
            <Megaphone className="h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-widest text-[10px]">Total Subs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4,829</div>
            <p className="text-[10px] opacity-80 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +124 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Email Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">32.4%</div>
            <p className="text-[10px] text-green-500 font-bold mt-1">Above industry avg (21%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">SMS Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5.8%</div>
            <p className="text-[10px] text-muted-foreground mt-1">Direct ROI from SMS</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
             <CardTitle>Recent Campaigns</CardTitle>
             <CardDescription>Performance of your latest outreach.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {campaigns.map((camp, i) => (
               <div key={i} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                     <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-white", camp.color)}>
                        {camp.type === 'Email' ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                     </div>
                     <div>
                        <h4 className="font-bold text-sm">{camp.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                           <Badge variant="outline" className="text-[9px] uppercase font-bold py-0">{camp.status}</Badge>
                           <span className="text-[10px] text-muted-foreground">• {camp.type}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold">{camp.reach} Reach</p>
                        <p className="text-[10px] text-muted-foreground">{camp.conv} Conversion</p>
                     </div>
                     <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
             ))}
          </CardContent>
          <CardFooter>
             <Button variant="outline" className="w-full">View All Campaigns</Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                AI Content Helper
             </CardTitle>
             <CardDescription>Generate high-converting copy in seconds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
             <div className="p-4 rounded-lg bg-muted border-2 border-dashed flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                   <Megaphone className="h-6 w-6" />
                </div>
                <div>
                   <p className="font-bold">What are you promoting?</p>
                   <p className="text-xs text-muted-foreground max-w-[200px]">Describe your offer and our AI will draft the campaign content for you.</p>
                </div>
                <Button variant="outline" size="sm" className="mt-2">Start Drafting</Button>
             </div>
          </CardContent>
          <CardFooter className="bg-amber-500/5 text-amber-700 text-[10px] p-4 flex items-center justify-center gap-2">
             <CheckCircle2 className="h-3 w-3" />
             AI suggests campaigns based on customer booking trends.
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card>
            <CardHeader className="pb-4">
               <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" /> Audiences
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {[
                 { label: 'Active Members', count: '124', percent: 85 },
                 { label: 'Lapsed (30+ days)', count: '42', percent: 15 },
                 { label: 'High Spenders', count: '89', percent: 40 },
               ].map((seg, i) => (
                 <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                       <span>{seg.label}</span>
                       <span className="font-bold">{seg.count}</span>
                    </div>
                    <Progress value={seg.percent} className="h-1.5" />
                 </div>
               ))}
            </CardContent>
         </Card>
         
         <Card className="md:col-span-2">
            <CardHeader>
               <CardTitle>Upcoming Automated Events</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="p-4 border rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                         <Badge>Birthday Offer</Badge>
                         <Calendar className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">Sends automatically on customer's birth date.</p>
                      <Button variant="link" size="sm" className="p-0 h-auto text-primary">Manage Template</Button>
                   </div>
                   <div className="p-4 border rounded-xl space-y-2 opacity-50">
                      <div className="flex justify-between items-start">
                         <Badge variant="outline">New Member Intro</Badge>
                         <Calendar className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">Coming soon: Automated onboarding welcome sequence.</p>
                      <Button variant="link" size="sm" className="p-0 h-auto text-muted-foreground">Coming Soon</Button>
                   </div>
                </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
