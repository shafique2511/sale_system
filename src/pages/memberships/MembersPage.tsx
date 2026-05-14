import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  UserPlus, 
  Filter, 
  MoreVertical,
  QrCode,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockCustomers } from '@/constants/mockData';

export const MembersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const activeMembers = mockCustomers.filter(c => c.membership !== 'None');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Members</h1>
          <p className="text-muted-foreground">Monitor your member base and their usage history.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Enroll Member
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search members..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hits Remaining</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{member.membership}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm">Active</span>
                  </div>
                </TableCell>
                <TableCell>
                  {member.membership.includes('VIP') || member.membership.includes('Platinum') ? (
                    <span className="text-xs font-bold text-primary">UNLIMITED</span>
                  ) : (
                    <span className="font-medium px-2 py-0.5 rounded bg-muted">3 / 4</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  Dec 12, 2026
                </TableCell>
                <TableCell className="text-right flex justify-end gap-1">
                  <Button variant="ghost" size="icon" title="Digital Card">
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="View Usage">
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
