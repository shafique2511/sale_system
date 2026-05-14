import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Scissors, 
  MoreVertical,
  ChevronRight,
  History,
  CheckCircle2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockBookings } from '@/constants/mockData';

export const PortalBookingsPage = () => {
  const upcoming = mockBookings;
  const history = [
    { id: 'h1', service: 'Beard Trim', date: 'April 12, 2026', time: '10:00 AM', staff: 'Jessica', price: 25, status: 'Completed' },
    { id: 'h2', service: 'Full Service Haircut', date: 'March 05, 2026', time: '02:30 PM', staff: 'Alex', price: 45, status: 'Completed' },
  ];

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
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 md:flex-none gap-2 px-8">
            <History className="h-4 w-4" />
            History
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
                              <Badge variant="outline" className="text-primary border-primary/30 uppercase tracking-tighter text-[10px] font-bold">Confirmed / Paid</Badge>
                              <h3 className="text-xl font-bold">{booking.service}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> Main Street Branch
                              </p>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-bold text-primary">{booking.time}</p>
                              <p className="text-xs text-muted-foreground">{booking.date}</p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                {booking.staff.charAt(0)}
                              </div>
                              <div className="text-xs">
                                <p className="text-muted-foreground">Staff Member</p>
                                <p className="font-bold">{booking.staff}</p>
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
                        <p className="text-2xl font-bold">$45</p>
                        <Badge variant="secondary" className="text-[9px]">INVOICED</Badge>
                     </div>
                  </div>
               </CardContent>
            </Card>
          ))}
          
          <Button variant="outline" className="w-full h-24 border-2 border-dashed text-muted-foreground hover:text-primary hover:border-primary/50 gap-2 text-lg">
             <Calendar className="h-5 w-5" />
             Book New Appointment
          </Button>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
           {history.map(item => (
             <Card key={item.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                <CardContent className="p-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                            <CheckCircle2 className="h-5 w-5" />
                         </div>
                         <div>
                            <h4 className="font-bold text-sm">{item.service}</h4>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.date} • {item.staff}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold">${item.price.toFixed(2)}</p>
                            <p className="text-[10px] text-muted-foreground">Paid</p>
                         </div>
                         <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                   </div>
                </CardContent>
             </Card>
           ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
