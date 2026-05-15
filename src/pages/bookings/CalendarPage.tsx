import React, { useEffect, useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Scissors, 
  Coffee,
  MoreVertical,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { bookingService } from '@/services/bookingService';
import { staffService } from '@/services/staffService';
import { toast } from 'sonner';

export const CalendarPage = () => {
  const { businessId } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [bookingsData, staffData] = await Promise.all([
        bookingService.getBookings(businessId),
        staffService.getStaff(businessId)
      ]);
      setBookings(bookingsData);
      setStaff(staffData);
    } catch (error) {
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [businessId]);

  const hours = Array.from({ length: 11 }, (_, i) => i + 9); // 9 AM to 7 PM

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter bookings for the selected date
  const dailyBookings = bookings.filter(b => {
    if (!date) return false;
    const bookingDate = new Date(b.booking_date);
    return bookingDate.toDateString() === date.toDateString();
  });

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Manage your shop schedule and staff availability.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Book Service
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden min-h-0">
        {/* Left Side: Calendar & Staff Filters */}
        <div className="w-full md:w-80 space-y-6 shrink-0 overflow-y-auto pr-2">
          <Card>
            <CardContent className="p-4">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-0 w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase text-muted-foreground tracking-tighter">Scheduled Personnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {staff.map((member) => (
                <div key={member.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary uppercase">
                      {member.full_name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.full_name || 'Staff member'}</p>
                      <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
              {staff.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">No staff profiles found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Timeline View */}
        <Card className="flex-1 flex flex-col overflow-hidden border-2 shadow-inner bg-muted/5">
          <CardHeader className="border-b bg-muted/30 flex-row items-center justify-between space-y-0 py-4 shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 border rounded-md overflow-hidden bg-background">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-none border-r"
                  onClick={() => {
                    const newDate = new Date(date || new Date());
                    newDate.setDate(newDate.getDate() - 1);
                    setDate(newDate);
                  }}
                >
                   <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-4 py-1 text-sm font-bold min-w-[140px] text-center">
                  {date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-none border-l"
                  onClick={() => {
                    const newDate = new Date(date || new Date());
                    newDate.setDate(newDate.getDate() + 1);
                    setDate(newDate);
                  }}
                >
                   <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setDate(new Date())}>Today</Button>
            </div>
            <div className="hidden sm:flex items-center border rounded-md p-0.5 bg-muted">
              <Button variant="ghost" size="sm" className="bg-background shadow-sm h-7 text-xs px-4">Day</Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs px-4">Week</Button>
            </div>
          </CardHeader>
          
          <div className="flex-1 overflow-y-auto relative bg-[linear-gradient(to_bottom,transparent_49%,hsl(var(--muted)/0.4)_50%,transparent_51%)] bg-[length:100%_4rem]">
            {hours.map((hour) => {
              const hourString = `${hour}:00:00`;
              const hourBookings = dailyBookings.filter(b => b.start_time.startsWith(`${hour}:`));
              
              return (
                <div key={hour} className="flex h-16 group">
                  <div className="w-20 text-right pr-4 pt-1 text-[10px] text-muted-foreground font-mono shrink-0">
                    {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
                  </div>
                  <div className="flex-1 border-l relative group-hover:bg-primary/5 transition-colors">
                    {hourBookings.map((booking) => (
                      <div 
                        key={booking.id}
                        className="absolute top-1 left-2 right-4 bg-primary text-primary-foreground p-3 rounded-lg shadow-lg border-2 border-primary-foreground/20 animate-in zoom-in-95 duration-300 group/status z-10"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <Scissors className="h-3 w-3" />
                              <p className="text-xs font-bold uppercase tracking-wider">{booking.service?.name || 'Service'}</p>
                            </div>
                            <h4 className="font-bold text-sm mt-1">{booking.customer?.name || 'Walk-in'} - <span className="capitalize">{booking.status}</span></h4>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-white/20">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-[10px] opacity-90 font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {booking.staff?.full_name || 'UNASSIGNED'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {booking.start_time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
