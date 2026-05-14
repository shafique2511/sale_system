import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  TrendingUp, 
  Plus, 
  MoreVertical,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { branchService, Branch } from '@/services/branchService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const BranchesPage = () => {
  const { businessId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      if (!businessId) return;
      setLoading(true);
      try {
        const data = await branchService.getBranches(businessId);
        setBranches(data);
      } catch (error) {
        toast.error('Failed to load branches');
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
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
          <h1 className="text-3xl font-bold tracking-tight">Branch Management</h1>
          <p className="text-muted-foreground">Manage multiple locations and compare geographical performance.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Branch
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           {branches.map((branch) => (
             <Card key={branch.id} className="overflow-hidden group hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row">
                   <div className="w-full sm:w-48 bg-muted border-r flex items-center justify-center p-8">
                      <div className="relative">
                         <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                            <MapPin className="h-8 w-8" />
                         </div>
                         {branch.is_active ? (
                            <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-green-500 border-2 border-white" />
                         ) : (
                            <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 border-2 border-white" />
                         )}
                      </div>
                   </div>
                   <div className="flex-1 p-6 space-y-4">
                      <div className="flex justify-between items-start">
                         <div>
                            <div className="flex items-center gap-2">
                               <h3 className="text-xl font-bold">{branch.name}</h3>
                               <Badge variant={branch.is_primary ? 'default' : 'secondary'} className="text-[10px] py-0">
                                  {branch.is_primary ? 'Primary' : 'Branch'}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                               <Navigation className="h-3 w-3" />
                               {branch.address || 'No address provided'}
                            </p>
                         </div>
                         <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
                         <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                               <Users className="h-3 w-3" /> Staff
                            </p>
                            <p className="text-sm font-bold">Managed</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                               <TrendingUp className="h-3 w-3" /> Status
                            </p>
                            <p className={cn("text-sm font-bold", branch.is_active ? "text-green-500" : "text-red-500")}>
                               {branch.is_active ? 'Active' : 'Inactive'}
                            </p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                               <Phone className="h-3 w-3" /> Phone
                            </p>
                            <p className="text-xs font-medium">{branch.phone || 'N/A'}</p>
                         </div>
                         <div className="flex items-center justify-end">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto h-8 text-xs font-bold shadow-sm">Manage</Button>
                         </div>
                      </div>
                   </div>
                </div>
             </Card>
           ))}
           {branches.length === 0 && (
             <div className="text-center py-12 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">No branches found. Add your first location!</p>
             </div>
           )}
        </div>

        <div className="space-y-6">
           <Card>
              <CardHeader>
                 <CardTitle className="text-lg">Network Overview</CardTitle>
                 <CardDescription>System-wide location data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex justify-between items-center bg-muted/50 p-4 rounded-xl">
                    <div>
                       <p className="text-2xl font-bold">{branches.length}</p>
                       <p className="text-xs text-muted-foreground">Total Branches</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                       <MapPin className="h-5 w-5" />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick Stats</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Active Now</span>
                          <span className="font-bold flex items-center gap-1">
                             <CheckCircle2 className="h-3 w-2 text-green-500" /> {branches.filter(b => b.is_active).length} Locations
                          </span>
                       </div>
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="bg-primary/5 text-primary text-[10px] p-4 flex flex-col items-center text-center gap-1">
                 <p className="font-bold">PRO TIP</p>
                 <p className="opacity-80">Branches share a unified customer loyalty database for seamless client experiences.</p>
              </CardFooter>
           </Card>

           <Card>
              <CardHeader>
                 <CardTitle className="text-lg">Branch Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 <Button variant="outline" className="w-full justify-start gap-2 h-10">
                    <Clock className="h-4 w-4" /> Global Business Hours
                 </Button>
                 <Button variant="outline" className="w-full justify-start gap-2 h-10">
                    <Mail className="h-4 w-4" /> Shared Email Templates
                 </Button>
                 <Button variant="outline" className="w-full justify-start gap-2 h-10">
                    <AlertCircle className="h-4 w-4" /> Closure Alerts
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
