import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Star, 
  CreditCard, 
  Gift, 
  ArrowRight,
  TrendingUp,
  Store,
  Loader2
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { bookingService } from '@/services/bookingService';
import { customerService } from '@/services/customerService';
import { portalService } from '@/services/portalService';

export const PortalHome = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState<any>(null);
  const [nextBooking, setNextBooking] = useState<any>(null);
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId || !profile) return;
      setLoading(true);
      try {
        const [biz, customers] = await Promise.all([
          portalService.getBusinessInfo(businessId),
          customerService.getCustomers(businessId)
        ]);

        setBusinessName(biz.name);
        
        // Find current user in the customers table to get points/etc
        const currentCustomer = customers.find((c: any) => c.email === profile.email);
        setCustomerData(currentCustomer || null);
        
        const bookings = await bookingService.getBookings(businessId);
        const userBookings = bookings.filter((b: any) => b.customer_id === profile.id);
        if (userBookings.length > 0) {
          setNextBooking(userBookings[0]);
        }
      } catch (error) {
        console.error('Portal home load error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      fetchData();
    }
  }, [businessId, profile]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = profile?.full_name || customerData?.name || 'Customer';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Hi, {displayName.split(' ')[0]}!</h1>
          <p className="text-muted-foreground flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            Member
          </p>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-bold text-primary">
          {displayName.charAt(0)}
        </div>
      </div>

      {/* Points & Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <TrendingUp className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-xs uppercase tracking-widest opacity-80 font-bold">Points Balance</p>
            <p className="text-3xl font-bold mt-1">{customerData?.points || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Gift className="h-6 w-6 mb-2 text-primary" />
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Rewards</p>
            <p className="text-3xl font-bold mt-1">Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Next Appointment */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-bold text-lg">Next Appointment</h2>
          <Link to={`/portal/${businessId}/bookings`}>
            <Button variant="link" size="sm" className="h-auto p-0">View All</Button>
          </Link>
        </div>
        {nextBooking ? (
          <Card className="border-2 border-primary/20 shadow-lg shadow-primary/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="text-primary border-primary/30 mb-2 capitalize">{nextBooking.status}</Badge>
                  <h3 className="text-xl font-bold leading-tight">{nextBooking.service?.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {businessName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{nextBooking.start_time}</p>
                  <p className="text-xs text-muted-foreground">{new Date(nextBooking.booking_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t">
                 <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {nextBooking.staff?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-xs">
                      <p className="text-muted-foreground">Staff Member</p>
                      <p className="font-bold">{nextBooking.staff?.full_name || 'Unassigned'}</p>
                    </div>
                 </div>
                 <Button variant="outline" size="sm">Reschedule</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed flex items-center justify-center p-8 text-center">
            <div>
              <Calendar className="h-8 w-8 mx-auto text-muted-foreground opacity-20 mb-2" />
              <p className="text-sm text-muted-foreground">No upcoming bookings found.</p>
              <Link to={`/portal/${businessId}/book`}>
                <Button variant="link">Book one now</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-3">
        <Link to={`/portal/${businessId}/book`}>
          <Button className="w-full h-16 justify-between px-6 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 group" size="lg">
            Book New Service
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <div className="grid grid-cols-2 gap-3">
          <Link to={`/portal/${businessId}/membership`}>
            <Button variant="outline" className="w-full h-20 flex-col gap-2 rounded-2xl border-2">
              <CreditCard className="h-5 w-5" />
              Membership
            </Button>
          </Link>
          <Link to={`/portal/${businessId}/rewards`}>
            <Button variant="outline" className="w-full h-20 flex-col gap-2 rounded-2xl border-2">
              <Gift className="h-5 w-5" />
              Redeem points
            </Button>
          </Link>
        </div>
      </div>

      {/* Membership Card Preview */}
      <div className="pt-4">
        <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-[2rem] overflow-hidden border-0 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <CreditCard className="h-48 w-48 rotate-12" />
          </div>
          <CardHeader>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-60">Membership Card</span>
              <div className="h-10 w-10 flex items-center justify-center p-2 bg-white/10 rounded-full backdrop-blur-sm">
                <Store className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-8">
              <CardTitle className="text-2xl font-light tracking-widest uppercase">{displayName.toUpperCase()}</CardTitle>
              <CardDescription className="text-white/60 font-mono mt-1">**** **** **** {profile?.id?.slice(-4) || '0000'}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-12 flex justify-between items-end relative z-10">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest opacity-40">Loyalty Tier</p>
              <p className="text-sm font-bold text-amber-400">ACTIVE MEMBER</p>
            </div>
            <div className="text-right space-y-1">
               <p className="text-[10px] uppercase tracking-widest opacity-40">Status</p>
               <p className="text-sm font-bold">Standard</p>
            </div>
          </CardContent>
          <div className="h-2 bg-amber-400/20 absolute bottom-0 left-0 w-full" />
        </Card>
      </div>
    </div>
  );
};

