import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

export const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const transactions = [
    { id: 'TXN-001', customer: 'John Doe', amount: 45.00, method: 'Credit Card', status: 'Completed', date: 'May 14, 2:30 PM', branch: 'Main Street' },
    { id: 'TXN-002', customer: 'Jane Smith', amount: 32.50, method: 'Cash', status: 'Completed', date: 'May 14, 1:15 PM', branch: 'West End' },
    { id: 'TXN-003', customer: 'Robert Johnson', amount: 85.00, method: 'Credit Card', status: 'Pending', date: 'May 14, 11:45 AM', branch: 'Main Street' },
    { id: 'TXN-004', customer: 'Emily Brown', amount: 12.00, method: 'Apple Pay', status: 'Completed', date: 'May 13, 4:20 PM', branch: 'Main Street' },
    { id: 'TXN-005', customer: 'Michael Wilson', amount: 55.00, method: 'Credit Card', status: 'Failed', date: 'May 13, 3:10 PM', branch: 'West End' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments & Transactions</h1>
          <p className="text-muted-foreground">Monitor real-time revenue and payment status across branches.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button className="gap-2">
            <Filter className="h-4 w-4" />
            Date Range
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gross Revenue</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">$12,450.00</div>
             <p className="text-[10px] text-green-500 font-bold mt-1">+15% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">428</div>
             <p className="text-[10px] text-muted-foreground font-bold mt-1">98.2% Success Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Transaction</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">$29.10</div>
             <p className="text-[10px] text-muted-foreground font-bold mt-1">Steady growth</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">Pending Payout</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold text-primary">$3,204.45</div>
             <p className="text-[10px] text-muted-foreground font-bold mt-1 italic">ETA: Tomorrow</p>
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
                  placeholder="ID, Customer or Method..." 
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
                <TableHead>Date & Branch</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                  <TableCell className="font-bold">{txn.customer}</TableCell>
                  <TableCell className="font-bold text-primary">${txn.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{txn.method}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        txn.status === 'Completed' ? 'default' : 
                        txn.status === 'Pending' ? 'secondary' : 'destructive'
                      }
                      className="gap-1"
                    >
                      {txn.status === 'Completed' && <CheckCircle2 className="h-3 w-3" />}
                      {txn.status === 'Pending' && <Clock className="h-3 w-3" />}
                      {txn.status === 'Failed' && <AlertCircle className="h-3 w-3" />}
                      {txn.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <p className="font-medium">{txn.date}</p>
                      <p className="text-muted-foreground uppercase text-[9px] font-bold tracking-tighter">{txn.branch}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
