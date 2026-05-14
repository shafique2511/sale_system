import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  DollarSign, 
  Calendar,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { posService } from '@/services/posService';
import { toast } from 'sonner';

export const PaymentsPage = () => {
  const { businessId } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchData = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await posService.getRecentOrders(businessId, 50);
      setTransactions(data);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [businessId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredTransactions = transactions.filter(txn => 
    txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (txn.customer?.name && txn.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.total_amount), 0);
  const avgTransaction = transactions.length > 0 ? totalRevenue / transactions.length : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments & Transactions</h1>
          <p className="text-muted-foreground">Monitor real-time revenue and payment status across branches.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Gross Revenue</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
             <p className="text-[10px] text-green-500 font-bold mt-1">Total across {transactions.length} sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{transactions.length}</div>
             <p className="text-[10px] text-muted-foreground font-bold mt-1">Processed transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Avg Ticket</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">${avgTransaction.toFixed(2)}</div>
             <p className="text-[10px] text-muted-foreground font-bold mt-1">Per transaction average</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary uppercase tracking-widest text-[10px]">Active Today</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold text-primary">{transactions.filter(t => new Date(t.created_at).toDateString() === new Date().toDateString()).length}</div>
             <p className="text-[10px] text-muted-foreground font-bold mt-1">Items processed today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="space-y-1">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Live stream of business income.</CardDescription>
             </div>
             <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                   placeholder="Search ID, Customer or Method..." 
                   className="pl-10 h-10" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-mono text-[10px]">{txn.id.slice(0, 8)}</TableCell>
                  <TableCell className="font-bold">{txn.customer?.name || 'Walk-in'}</TableCell>
                  <TableCell className="font-bold text-primary">${Number(txn.total_amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs uppercase">{txn.payment_method || 'Cash'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="default"
                      className="gap-1 bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <p className="font-medium">{new Date(txn.created_at).toLocaleDateString()}</p>
                      <p className="text-muted-foreground uppercase text-[9px] font-bold tracking-tighter">
                        {new Date(txn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
