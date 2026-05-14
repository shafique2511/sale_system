import React from 'react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  UserPlus, 
  Settings, 
  Calendar, 
  TrendingUp, 
  MoreVertical,
  Mail,
  MapPin
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { mockStaff } from '@/constants/mockData';

export const StaffPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage your team members, schedules, and commission rates.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Onboard Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStaff.map((staff) => (
          <Card key={staff.id} className="relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div 
              className="absolute top-0 left-0 w-full h-1" 
              style={{ backgroundColor: staff.color }}
            />
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <Avatar className="h-12 w-12 ring-2 ring-background ring-offset-2" style={{ backgroundColor: staff.color + '20' }}>
                  <AvatarFallback className="font-bold" style={{ color: staff.color }}>
                    {staff.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  } />
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Staff Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="gap-2">
                      <Settings className="h-4 w-4" /> Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Calendar className="h-4 w-4" /> View Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <TrendingUp className="h-4 w-4" /> Commission Report
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="mt-4">
                <h3 className="font-bold text-lg leading-tight">{staff.name}</h3>
                <p className="text-sm text-muted-foreground">{staff.role}</p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {staff.branch} Branch
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  {staff.commission}% Commission Rate
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Badge variant={staff.status === 'Active' ? 'default' : 'outline'} className={staff.status === 'Active' ? 'bg-green-500 hover:bg-green-600' : ''}>
                  {staff.status}
                </Badge>
                <Button variant="outline" size="sm" className="h-8">Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border rounded-lg bg-card mt-8">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Staff Performance Overview</h2>
          <p className="text-sm text-muted-foreground">Bookings completed and commission earned this month.</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Total Bookings</TableHead>
              <TableHead>Service Sales</TableHead>
              <TableHead>Product Sales</TableHead>
              <TableHead>Commission Earned</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStaff.slice(0, 3).map((staff) => (
              <TableRow key={staff.id}>
                <TableCell className="font-medium">{staff.name}</TableCell>
                <TableCell>42</TableCell>
                <TableCell>$1,240.00</TableCell>
                <TableCell>$350.00</TableCell>
                <TableCell className="text-green-600 font-bold">$385.00</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Report</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
