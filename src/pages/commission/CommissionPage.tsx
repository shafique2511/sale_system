import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Calendar,
  Download,
  Filter,
  DollarSign,
  UserCheck,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { commissionService } from '@/services/commissionService';
import { toast } from 'sonner';

export const CommissionPage = () => {
  const { businessId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId) return;
      setLoading(true);
      try {
        const data = await commissionService.getCommissions(businessId);
        setCommissions(data);
      } catch (error) {
        toast.error('Failed to load commissions');
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

  const totalEarned = commissions.reduce((sum, c) => sum + Number(c.earned_amount), 0);
  const pendingEarned = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + Number(c.earned_amount), 0);
  const staffCount = new Set(commissions.map(c => c.staff_id)).size;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Commission</h1>
          <p className="text-muted-foreground">Detailed calculation and payout tracking for staff earnings.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Payroll Period
          </Button>
          <Button className="gap-2">
            <Calculator className="h-4 w-4" />
            Recalculate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Total Commission (All Time)</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">${totalEarned.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground mt-1">Calculated across {staffCount} staff members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Recent Payout Status</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">Updated</div>
             <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" /> Latest calculated: {commissions.length > 0 ? new Date(commissions[0].created_at).toLocaleDateString() : 'N/A'}
             </p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary uppercase tracking-widest text-[10px]">Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold text-primary">${pendingEarned.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground mt-1">Ready for next payroll</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
           <div className="flex justify-between items-center">
              <div>
                 <CardTitle>Commission Breakdown</CardTitle>
                 <CardDescription>Individual transactions and earnings.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                 <Download className="h-4 w-4" /> Export
              </Button>
           </div>
        </CardHeader>
        <CardContent>
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Staff Member</TableHead>
                 <TableHead>Sale Amount</TableHead>
                 <TableHead>Rate</TableHead>
                 <TableHead>Earned</TableHead>
                 <TableHead>Date</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead className="text-right">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {commissions.map((row) => (
                 <TableRow key={row.id}>
                    <TableCell>
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs uppercase">
                             {row.staff?.full_name?.charAt(0) || 'S'}
                          </div>
                          <span className="font-bold">{row.staff?.full_name || 'Staff Member'}</span>
                       </div>
                    </TableCell>
                    <TableCell>${row.sale_amount.toLocaleString()}</TableCell>
                    <TableCell>
                       <Badge variant="secondary">{row.commission_rate}%</Badge>
                    </TableCell>
                    <TableCell className="font-bold text-primary">${row.earned_amount.toFixed(2)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(row.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                       <Badge variant={row.status === 'paid' ? 'outline' : 'default'} className={row.status === 'paid' ? 'border-green-500 text-green-600 capitalize' : 'capitalize'}>
                          {row.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="sm">Details</Button>
                    </TableCell>
                 </TableRow>
               ))}
               {commissions.length === 0 && (
                 <TableRow>
                   <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                     No commission data found.
                   </TableCell>
                 </TableRow>
               )}
             </TableBody>
           </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card>
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="h-5 w-5" /> Recent Payouts
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {[
                    { name: 'Alex Thompson', amount: 840, date: 'May 01, 2026' },
                    { name: 'Sam Wilson', amount: 320, date: 'May 01, 2026' },
                  ].map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                       <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                             <DollarSign className="h-3 w-3" />
                          </div>
                          <div>
                             <p className="text-sm font-bold">{p.name}</p>
                             <p className="text-[10px] text-muted-foreground uppercase">{p.date}</p>
                          </div>
                       </div>
                       <span className="font-bold">${p.amount}</span>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="bg-muted/30">
            <CardHeader>
               <CardTitle className="text-lg">Commission Logic</CardTitle>
               <CardDescription>Global rules for earning calculations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-1">
                  <p className="text-sm font-bold">Standard Service Rate: 15%</p>
                  <p className="text-xs text-muted-foreground">Applies to all haircuts and standard styling services.</p>
               </div>
               <div className="space-y-1 pt-3 border-t">
                  <p className="text-sm font-bold">Product Sales Rate: 5%</p>
                  <p className="text-xs text-muted-foreground">Applies to hair wax, oils, and physical merchandise.</p>
               </div>
               <div className="space-y-1 pt-3 border-t font-medium text-xs italic">
                  * Commissions are calculated only on completed and fully paid bookings.
               </div>
               <Button variant="link" className="p-0 h-auto text-xs">Edit Global Rules</Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};
