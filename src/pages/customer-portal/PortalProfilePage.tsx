import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  MapPin, 
  CreditCard,
  LogOut,
  Camera,
  ChevronRight,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export const PortalProfilePage = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-6">
           <Card className="text-center p-6">
              <div className="relative inline-block mx-auto">
                 <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center text-3xl font-extrabold text-primary">
                    JD
                 </div>
                 <Button variant="secondary" size="icon" className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full shadow-lg">
                    <Camera className="h-4 w-4" />
                 </Button>
              </div>
              <h3 className="text-xl font-bold mt-4 leading-tight">John Doe</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Gold Member Since 2024</p>
              <div className="flex justify-center gap-4 mt-6">
                 <div className="text-center">
                    <p className="text-lg font-bold">12</p>
                    <p className="text-[10px] uppercase text-muted-foreground">Visits</p>
                 </div>
                 <div className="w-px h-8 bg-muted" />
                 <div className="text-center">
                    <p className="text-lg font-bold">1.2k</p>
                    <p className="text-[10px] uppercase text-muted-foreground">Points</p>
                 </div>
              </div>
           </Card>

           <nav className="flex flex-col gap-1">
              {[
                { name: 'Personal Info', icon: User, active: true },
                { name: 'Security', icon: Shield },
                { name: 'Notifications', icon: Bell },
                { name: 'Payment Methods', icon: CreditCard },
              ].map((item, i) => (
                <Button 
                  key={i} 
                  variant={item.active ? "secondary" : "ghost"} 
                  className={cn("justify-between px-4 h-12 font-bold", item.active && "bg-primary/10 text-primary")}
                >
                   <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {item.name}
                   </div>
                   <ChevronRight className="h-4 w-4 opacity-50" />
                </Button>
              ))}
              <Button variant="ghost" className="justify-start px-4 h-12 text-destructive hover:text-destructive hover:bg-destructive/10 mt-4 font-bold">
                 <LogOut className="h-4 w-4 mr-3" />
                 Sign Out
              </Button>
           </nav>
        </div>

        <div className="flex-1 space-y-6">
           <Card>
              <CardHeader>
                 <CardTitle>Personal Information</CardTitle>
                 <CardDescription>Maintain your contact details updated.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" /> First Name
                       </Label>
                       <Input defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                       <Label className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" /> Last Name
                       </Label>
                       <Input defaultValue="Doe" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                       <Mail className="h-3 w-3 text-muted-foreground" /> Email Address
                    </Label>
                    <Input type="email" defaultValue="john.doe@example.com" />
                 </div>
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                       <Phone className="h-3 w-3 text-muted-foreground" /> Phone Number
                    </Label>
                    <Input defaultValue="+1 (555) 000-1234" />
                 </div>
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                       <Calendar className="h-3 w-3 text-muted-foreground" /> Date of Birth
                    </Label>
                    <Input type="date" defaultValue="1990-01-01" />
                 </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                 <Button className="ml-auto px-8 font-bold">Update Profile</Button>
              </CardFooter>
           </Card>

           <Card>
              <CardHeader>
                 <CardTitle>Preferences</CardTitle>
                 <CardDescription>Control your platform experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                       <Label>Push Notifications</Label>
                       <p className="text-xs text-muted-foreground">Receive booking reminders on your mobile.</p>
                    </div>
                    <Switch defaultChecked />
                 </div>
                 <div className="flex items-center justify-between border-t pt-6">
                    <div className="space-y-0.5">
                       <Label>Marketing Emails</Label>
                       <p className="text-xs text-muted-foreground">Be the first to know about new rewards.</p>
                    </div>
                    <Switch />
                 </div>
                 <div className="flex items-center justify-between border-t pt-6">
                    <div className="space-y-0.5">
                       <Label>Show Profile Pic</Label>
                       <p className="text-xs text-muted-foreground">Allow staff to see your photo for faster check-in.</p>
                    </div>
                    <Switch defaultChecked />
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
