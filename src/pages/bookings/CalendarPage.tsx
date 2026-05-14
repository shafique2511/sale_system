import React, { useState } from 'react';
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
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockBookings } from '@/constants/mockData';

export const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const hours = Array.from({ length: 11 }, (_, i) => i + 9); // 9 AM to 7 PM

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Manage your shop schedule and staff availability.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            Print Daily Sheet
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Book Service
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Left Side: Calendar & Staff Filters */}
        <div className="w-full md:w-80 space-y-6">
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
              <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Staff Schedules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Alex', 'Jessica', 'Sam'].map((name) => (
                <div key={name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-[10px] text-green-500 font-bold">On Duty</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    View
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Timeline View */}
        <Card className="flex-1 flex flex-col overflow-hidden border-2">
          <CardHeader className="border-b bg-muted/30 flex-row items-center justify-between space-y-0 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 border rounded-md overflow-hidden bg-background">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-r">
                   <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-4 py-1 text-sm font-bold min-w-[140px] text-center">
                  {date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-l">
                   <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">Today</Button>
            </div>
            <div className="flex items-center border rounded-md p-0.5 bg-muted">
              <Button variant="ghost" size="sm" className="bg-background shadow-sm h-7 text-xs px-4">Day</Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs px-4">Week</Button>
            </div>
          </CardHeader>
          
          <div className="flex-1 overflow-y-auto relative bg-[linear-gradient(to_bottom,transparent_49%,hsl(var(--muted)/0.5)_50%,transparent_51%)] bg-[length:100%_4rem]">
            {hours.map((hour) => (
              <div key={hour} className="flex h-16 group">
                <div className="w-20 text-right pr-4 pt-1 text-xs text-muted-foreground font-mono">
                  {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
                </div>
                <div className="flex-1 border-l relative group-hover:bg-primary/5 transition-colors">
                  {/* Mock Appointment Rendering */}
                  {hour === 10 && (
                    <div className="absolute top-1 left-2 right-4 bg-primary text-primary-foreground p-3 rounded-lg shadow-lg border-2 border-primary-foreground/20 animate-in zoom-in-95 duration-300 group/item z-10">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Scissors className="h-3 w-3" />
                            <p className="text-xs font-bold uppercase tracking-wider">Haircut Service</p>
                          </div>
                          <h4 className="font-bold text-sm mt-1">John Doe - Confirmed</h4>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-white/20">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-[10px] opacity-90">
                        <span className="flex items-center gap-1 font-bold">
                          <User className="h-3 w-3" />
                          ALEX T.
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          45 MIN
                        </span>
                      </div>
                    </div>
                  )}

                  {hour === 14 && (
                    <div className="absolute top-1 left-2 right-4 bg-amber-500 text-white p-3 rounded-lg shadow-lg border-2 border-white/20 z-10">
                       <div className="flex items-center gap-2">
                          <Coffee className="h-3 w-3" />
                          <p className="text-xs font-bold uppercase tracking-wider">Premium Coffee Tasting</p>
                       </div>
                       <h4 className="font-bold text-sm mt-1">Private Event - 12 Guests</h4>
                       <div className="mt-2 text-[10px] opacity-90 font-bold">BRANCHE: WEST END</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
