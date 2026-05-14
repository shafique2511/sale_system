import React, { useEffect, useState } from 'react';
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
  MapPin,
  Loader2,
  RefreshCw
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
import { useAuth } from '@/hooks/useAuth';
import { staffService } from '@/services/staffService';
import { toast } from 'sonner';

export const StaffPage = () => {
  const { businessId } = useAuth();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await staffService.getStaff(businessId);
      setStaff(data);
    } catch (error) {
      toast.error('Failed to load staff');
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage your team members, schedules, and commission rates.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Onboard Staff
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {staff.map((member) => (
          <Card key={member.id} className="relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div 
              className="absolute top-0 left-0 w-full h-1 bg-primary" 
            />
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <Avatar className="h-12 w-12 ring-2 ring-background ring-offset-2">
                  <AvatarFallback className="font-bold bg-primary/10 text-primary">
                    {member.full_name?.charAt(0) || 'U'}
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
                <h3 className="font-bold text-lg leading-tight">{member.full_name || 'Unnamed User'}</h3>
                <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {member.branch?.name || 'Main'} Branch
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  Active
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
              <TableHead>Commission Earned</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.slice(0, 5).map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.full_name || 'Unnamed'}</TableCell>
                <TableCell>0</TableCell>
                <TableCell className="text-green-600 font-bold">$0.00</TableCell>
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
