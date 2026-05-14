import React, { useEffect, useState } from 'react';
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
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { marketingService } from '@/services/marketingService';
import { toast } from 'sonner';

export const MarketingPage = () => {
  const { businessId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [segments, setSegments] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId) return;
      setLoading(true);
      try {
        const [campaignsData, segmentsData] = await Promise.all([
          marketingService.getCampaigns(businessId),
          marketingService.getAudienceSegments(businessId)
        ]);
        setCampaigns(campaignsData);
        setSegments(segmentsData);
      } catch (error) {
        toast.error('Failed to load marketing data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [businessId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-blue-500';
      case 'Draft': return 'bg-amber-500';
      case 'Completed': return 'bg-green-500';
      default: return 'bg-muted';
    }
  };

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
            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-widest text-[10px]">Total Audience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{segments?.total || 0}</div>
            <p className="text-[10px] opacity-80 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Total customers reached
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Email campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{campaigns.filter(c => c.type === 'Email').length}</div>
            <p className="text-[10px] text-green-500 font-bold mt-1">Ready for engagement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">SMS campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{campaigns.filter(c => c.type === 'SMS').length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Direct outreach ready</p>
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
             {campaigns.map((camp) => (
                <div key={camp.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors cursor-pointer group">
                   <div className="flex items-center gap-4">
                      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-white", getStatusColor(camp.status))}>
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
                         <p className="text-xs font-bold">{camp.reach || 0} Reach</p>
                         <p className="text-[10px] text-muted-foreground">{camp.conversions || 0} Conversion</p>
                      </div>
                      <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                         <ArrowRight className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
             ))}
             {campaigns.length === 0 && (
               <div className="text-center py-8 text-muted-foreground">
                 No campaigns found. Start your first outreach!
               </div>
             )}
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
                <Button variant="outline" size="sm" className="mt-2 text-xs">Start AI Draft</Button>
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
                 { label: 'Active Members', count: segments?.active || 0, percent: (segments?.active / (segments?.total || 1)) * 100 },
                 { label: 'Lapsed (30+ days)', count: segments?.lapsed || 0, percent: (segments?.lapsed / (segments?.total || 1)) * 100 },
                 { label: 'High Spenders', count: segments?.highSpenders || 0, percent: (segments?.highSpenders / (segments?.total || 1)) * 100 },
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
