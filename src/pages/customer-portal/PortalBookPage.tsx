import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Scissors, 
  Clock, 
  ChevronRight,
  Sparkles,
  ChevronLeft,
  Loader2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useParams, useNavigate } from 'react-router-dom';
import { portalService } from '@/services/portalService';
import { bookingService } from '@/services/bookingService';
import { customerService } from '@/services/customerService';
import { toast } from 'sonner';

export const PortalBookPage = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId) return;
      setLoading(true);
      try {
        const [servicesData, staffData, customers] = await Promise.all([
          portalService.getPublicServices(businessId),
          portalService.getAvailableStaff(businessId),
          customerService.getCustomers(businessId)
        ]);
        setServices(servicesData);
        setStaff(staffData);
        if (customers.length > 0) {
          setCustomerId(customers[0].id);
        }
      } catch (error) {
        toast.error('Failed to load booking data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [businessId]);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleConfirm = async () => {
    if (!businessId || !customerId || !selectedService || !date || !time) return;

    setSubmitting(true);
    try {
      // Parse the time string (e.g., "09:00 AM")
      const [timeStr, period] = time.split(' ');
      let [hours, minutes] = timeStr.split(':').map(Number);
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      const startTime = new Date(date);
      startTime.setHours(hours, minutes, 0, 0);

      const endTime = new Date(startTime.getTime() + selectedService.duration_minutes * 60000);

      await bookingService.createBooking({
        business_id: businessId,
        customer_id: customerId,
        service_id: selectedService.id,
        staff_id: selectedStaff?.id || null,
        branch_id: selectedService.branch_id || null, // Fallback if branch_id is on service
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: 'pending', // Use pending as per schema default or common practice
        total_price: selectedService.price,
        notes: ''
      });
      toast.success('Appointment booked successfully!');
      navigate(`/portal/${businessId}`);
    } catch (error) {
      console.error('Booking Error:', error);
      toast.error('Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Book Service</h1>
          <p className="text-muted-foreground">Select your preferences below.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className={cn("h-2 w-8 rounded-full", step >= 1 ? "bg-primary" : "bg-muted")} />
           <div className={cn("h-2 w-8 rounded-full", step >= 2 ? "bg-primary" : "bg-muted")} />
           <div className={cn("h-2 w-8 rounded-full", step >= 3 ? "bg-primary" : "bg-muted")} />
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
           <h2 className="text-xl font-bold px-1">Select a Service</h2>
           <div className="grid grid-cols-1 gap-3">
             {services.map(service => (
               <Card 
                 key={service.id} 
                 className={cn(
                   "cursor-pointer transition-all hover:border-primary/50",
                   selectedService?.id === service.id ? "border-2 border-primary bg-primary/5 shadow-md" : ""
                 )}
                 onClick={() => setSelectedService(service)}
               >
                 <CardContent className="p-5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-primary">
                        <Scissors className="h-6 w-6" />
                     </div>
                     <div>
                       <h3 className="font-bold">{service.name}</h3>
                       <p className="text-xs text-muted-foreground">{service.description || 'Skilled professional'}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-lg">${service.price}</p>
                   </div>
                 </CardContent>
               </Card>
             ))}
             {services.length === 0 && <p className="text-center py-8 text-muted-foreground">No services available for booking yet.</p>}
           </div>
           <Button 
            className="w-full h-12 text-lg font-bold mt-6" 
            disabled={!selectedService}
            onClick={nextStep}
           >
             Continue to Staff
             <ChevronRight className="ml-2 h-5 w-5" />
           </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
           <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" onClick={prevStep}><ChevronLeft /></Button>
             <h2 className="text-xl font-bold">Choose Professional</h2>
           </div>
           <div className="grid grid-cols-1 gap-3">
              <Card 
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  selectedStaff === null ? "border-2 border-primary bg-primary/5 shadow-md" : ""
                )}
                onClick={() => setSelectedStaff(null)}
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                      ?
                    </div>
                    <div>
                      <h3 className="font-bold">Any Professional</h3>
                      <p className="text-xs text-muted-foreground">First available staff member</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {staff.map(person => (
                <Card 
                   key={person.id}
                   className={cn(
                     "cursor-pointer transition-all hover:border-primary/50",
                     selectedStaff?.id === person.id ? "border-2 border-primary bg-primary/5 shadow-md" : ""
                   )}
                   onClick={() => setSelectedStaff(person)}
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-bold text-primary">
                        {person.full_name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h3 className="font-bold">{person.full_name || 'Staff Member'}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{person.role}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
                      Popular
                    </Badge>
                  </CardContent>
                </Card>
              ))}
           </div>
           <Button 
            className="w-full h-12 text-lg font-bold mt-6" 
            onClick={nextStep}
           >
             Select Date & Time
             <ChevronRight className="ml-2 h-5 w-5" />
           </Button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
           <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" onClick={prevStep}><ChevronLeft /></Button>
             <h2 className="text-xl font-bold">Schedule Appointment</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border-0"
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Available Slots
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(t => (
                    <Button 
                      key={t}
                      variant={time === t ? "default" : "outline"}
                      className={cn("h-12", time === t && "shadow-lg shadow-primary/20")}
                      onClick={() => setTime(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
           </div>

           <Card className="bg-muted/50 border-dashed">
              <CardContent className="p-6">
                 <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold">Reservation Summary</h4>
                    <Badge variant="outline" className="border-primary text-primary">Prepaid Eligible</Badge>
                 </div>
                 <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                       <span className="text-muted-foreground">Service:</span>
                       <span className="font-bold">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-muted-foreground">Professional:</span>
                       <span className="font-bold">{selectedStaff?.full_name || 'Any Available'}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-muted-foreground">Date:</span>
                       <span className="font-bold">{date?.toLocaleDateString()} at {time || '...'}</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t mt-4 font-bold text-lg">
                       <span>Total Price:</span>
                       <span>${selectedService?.price.toFixed(2)}</span>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Button 
            className="w-full h-16 text-xl font-bold mt-6 shadow-2xl shadow-primary/30" 
            disabled={!time || submitting}
            onClick={handleConfirm}
           >
             {submitting ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : null}
             Confirm Booking
           </Button>
           <p className="text-center text-xs text-muted-foreground">
             By confirming, you agree to our 24-hour cancellation policy.
           </p>
        </div>
      )}
    </div>
  );
};

