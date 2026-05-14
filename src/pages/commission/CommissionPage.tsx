import React from 'react';
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
  UserCheck
} from 'lucide-react';

export const CommissionPage = () => {
  const staffCommissions = [
    { staff: 'Alex Thompson', sales: 4500, rate: '15%', earned: 675, status: 'Paid' },
    { staff: 'Jessica Lee', sales: 5200, rate: '15%', earned: 780, status: 'Pending' },
    { staff: 'Sam Wilson', sales: 2100, rate: '10%', earned: 210, status: 'Paid' },
    { staff: 'Sarah Parker', sales: 3800, rate: '12%', earned: 456, status: 'Pending' },
  ];

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
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Total Commission (MTD)</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">$2,121.00</div>
             <p className="text-xs text-muted-foreground mt-1">Calculated across 4 staff members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Avg Commission Rate</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">13.2%</div>
             <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" /> +1.2% from last period
             </p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary uppercase tracking-widest text-[10px]">Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold text-primary">$1,236.00</div>
             <p className="text-xs text-muted-foreground mt-1">Ready for next payroll</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
           <div className="flex justify-between items-center">
              <div>
                 <CardTitle>Commission Breakdown</CardTitle>
                 <CardDescription>Earnings by staff for the current payroll cycle.</CardDescription>
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
                 <TableHead>Total Sales</TableHead>
                 <TableHead>Commission Rate</TableHead>
                 <TableHead>Earned Amount</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead className="text-right">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {staffCommissions.map((row, i) => (
                 <TableRow key={i}>
                    <TableCell>
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">
                             {row.staff.charAt(0)}
                          </div>
                          <span className="font-bold">{row.staff}</span>
                       </div>
                    </TableCell>
                    <TableCell>${row.sales.toLocaleString()}</TableCell>
                    <TableCell>
                       <Badge variant="secondary">{row.rate}</Badge>
                    </TableCell>
                    <TableCell className="font-bold text-primary">${row.earned.toFixed(2)}</TableCell>
                    <TableCell>
                       <Badge variant={row.status === 'Paid' ? 'outline' : 'default'} className={row.status === 'Paid' ? 'border-green-500 text-green-600' : ''}>
                          {row.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="sm">View Logic</Button>
                    </TableCell>
                 </TableRow>
               ))}
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
