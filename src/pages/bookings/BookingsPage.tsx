import React, { useEffect, useState } from 'react';
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  MoreVertical, 
  Plus, 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { bookingService } from '@/services/bookingService';

export const BookingsPage = () => {
  const { businessId } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await bookingService.getBookings(businessId);
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [businessId]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.service?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'completed': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-muted-foreground bg-muted border-muted';
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">Manage all appointments and service requests.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendar View
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by customer or service..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Time & Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.customer?.name || 'Walk-in'}</TableCell>
                <TableCell>{booking.service?.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                      {booking.staff?.full_name?.charAt(0) || 'U'}
                    </div>
                    {booking.staff?.full_name || 'Unassigned'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(booking.start_time).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold">${Number(booking.total_price).toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    } />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2" onClick={() => handleUpdateStatus(booking.id, 'confirmed')}>
                        <CheckCircle2 className="h-4 w-4 text-green-500" /> Confirm
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => handleUpdateStatus(booking.id, 'completed')}>
                        <Clock className="h-4 w-4 text-blue-500" /> Complete
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => handleUpdateStatus(booking.id, 'cancelled')}>
                        <XCircle className="h-4 w-4 text-red-500" /> Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
