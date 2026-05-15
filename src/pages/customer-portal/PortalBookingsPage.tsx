import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  MoreVertical,
  ChevronRight,
  History,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { bookingService } from '@/services/bookingService';
import { customerService } from '@/services/customerService';
import { portalService } from '@/services/portalService';
import { toast } from 'sonner';

export const PortalBookingsPage = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId || !profile) return;
      setLoading(true);
      try {
        const [biz] = await Promise.all([
          portalService.getBusinessInfo(businessId)
        ]);
        setBusinessName(biz.name);
        
        const allBookings = await bookingService.getBookings(businessId);
        const userBookings = allBookings.filter((b: any) => b.customer_id === profile.id);
        setBookings(userBookings);
      } catch (error) {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    if (profile) {
      fetchData();
    }
  }, [businessId, profile]);

  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const history = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground">Manage your upcoming and past appointments.</p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="bg-muted w-full justify-start p-1 h-12">
          <TabsTrigger value="upcoming" className="flex-1 md:flex-none gap-2 px-8">
            <Calendar className="h-4 w-4" />
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 md:flex-none gap-2 px-8">
            <History className="h-4 w-4" />
            History ({history.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcoming.map(booking => (
            <Card key={booking.id} className="overflow-hidden">
               <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                     <div className="p-6 flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                           <div className="space-y-1">
                              <Badge variant="outline" className="text-primary border-primary/30 uppercase tracking-tighter text-[10px] font-bold capitalize">{booking.status}</Badge>
                              <h3 className="text-xl font-bold">{booking.service?.name}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {businessName}
                              </p>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-bold text-primary">{booking.start_time}</p>
                              <p className="text-xs text-muted-foreground">{new Date(booking.booking_date).toLocaleDateString()}</p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                {booking.staff?.full_name?.charAt(0) || 'U'}
                              </div>
                              <div className="text-xs">
                                <p className="text-muted-foreground">Staff Member</p>
                                <p className="font-bold">{booking.staff?.full_name || 'Unassigned'}</p>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <Button variant="outline" size="sm">Modify</Button>
                              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                           </div>
                        </div>
                     </div>
                     <div className="bg-primary/5 w-full md:w-32 border-l p-6 flex flex-col items-center justify-center gap-2">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Amount</p>
                        <p className="text-2xl font-bold">${booking.total_price}</p>
                        <Badge variant="secondary" className="text-[9px]">PAY ON ARRIVAL</Badge>
                     </div>
                  </div>
               </CardContent>
            </Card>
          ))}
          
          {upcoming.length === 0 && (
            <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground">No upcoming bookings found.</p>
            </div>
          )}
          
          <Link to={`/portal/${businessId}/book`}>
            <Button variant="outline" className="w-full h-24 border-2 border-dashed text-muted-foreground hover:text-primary hover:border-primary/50 gap-2 text-lg mt-4">
               <Calendar className="h-5 w-5" />
               Book New Appointment
            </Button>
          </Link>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
           {history.map(item => (
             <Card key={item.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                <CardContent className="p-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className={cn(
                           "h-10 w-10 rounded-full flex items-center justify-center",
                           item.status === 'completed' ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                         )}>
                            <CheckCircle2 className="h-5 w-5" />
                         </div>
                         <div>
                            <h4 className="font-bold text-sm">{item.service?.name}</h4>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                              {new Date(item.booking_date).toLocaleDateString()} • {item.staff?.full_name || 'Staff'}
                            </p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold">${(item.total_price || 0).toFixed(2)}</p>
                            <p className="text-[10px] text-muted-foreground capitalize">{item.status}</p>
                         </div>
                         <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                   </div>
                </CardContent>
             </Card>
           ))}
           {history.length === 0 && (
             <p className="text-center py-12 text-muted-foreground">No past bookings found.</p>
           )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

import { cn } from '@/lib/utils';

