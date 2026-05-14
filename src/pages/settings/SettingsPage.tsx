import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Building, 
  MapPin, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Smartphone,
  Globe,
  MoreVertical,
  Store,
  Plus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const SettingsPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your business profile, branches, and system preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="profile" className="gap-2">
            <Building className="h-4 w-4" />
            Business Profile
          </TabsTrigger>
          <TabsTrigger value="branches" className="gap-2">
            <MapPin className="h-4 w-4" />
            Branches
          </TabsTrigger>
          <TabsTrigger value="booking" className="gap-2">
            <Smartphone className="h-4 w-4" />
            Booking Settings
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            System Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>This information will be visible to your customers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 pb-6 border-b">
                  <div className="h-24 w-24 rounded-xl bg-muted border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-accent cursor-pointer transition-colors">
                    <Store className="h-8 w-8 mb-1" />
                    <span className="text-[10px] font-bold uppercase">Upload Logo</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight uppercase tracking-tight">Main Business Brand</h3>
                    <p className="text-xs text-muted-foreground">Recommended size: 512x512px. JPG, PNG or SVG.</p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm">Choose File</Button>
                      <Button variant="outline" size="sm">Remove</Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="biz-name">Business Name</Label>
                    <Input id="biz-name" defaultValue="OmniBarber & Coffee" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="biz-type">Business Type</Label>
                    <Input id="biz-type" defaultValue="Hybrid Barber + Cafe" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="biz-desc">Description</Label>
                    <Textarea 
                      id="biz-desc" 
                      placeholder="Tell your customers about your business..."
                      defaultValue="The ultimate destination for a fresh cut and a premium coffee brew."
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 bg-muted/20">
                <Button className="ml-auto">Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="biz-email">Public Email</Label>
                  <Input id="biz-email" type="email" defaultValue="hello@omnibiz.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biz-phone">Public Phone</Label>
                  <Input id="biz-phone" defaultValue="+1 234 567 890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biz-web">Website (Optional)</Label>
                  <Input id="biz-web" defaultValue="www.omnibiz.app" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          <div className="grid gap-6">
            {[
              { name: 'Main Street', address: '123 Downtown Ave, NY', phone: '+1 234 567 890', status: 'Main' },
              { name: 'West End Mall', address: 'Suite 405, West End Blvd, NY', phone: '+1 987 654 321', status: 'Branch' },
            ].map((branch) => (
              <Card key={branch.name} className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{branch.name}</h3>
                      <Badge variant={branch.status === 'Main' ? 'default' : 'secondary'}>
                        {branch.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{branch.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="outline" size="sm">Manage Staff</Button>
                   <Button variant="outline" size="sm">Opening Hours</Button>
                   <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </Card>
            ))}
            <Button variant="outline" className="h-24 w-full border-2 border-dashed text-muted-foreground hover:text-primary hover:border-primary/50 gap-2">
              <Plus className="h-5 w-5" />
              Add New Branch Location
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="booking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Booking Rules</CardTitle>
              <CardDescription>Control how customers can book services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Same-Day Booking</Label>
                  <p className="text-xs text-muted-foreground">Customers can book for the current day.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between border-t pt-6">
                <div className="space-y-0.5">
                  <Label>Booking Lead Time</Label>
                  <p className="text-xs text-muted-foreground">Minimum time before appointment to allow booking.</p>
                </div>
                <div className="w-32 flex items-center gap-2">
                  <Input type="number" defaultValue="2" />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Hours</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t pt-6">
                <div className="space-y-0.5">
                  <Label>Auto-Confirm Bookings</Label>
                  <p className="text-xs text-muted-foreground">New bookings are automatically set to 'Confirmed'.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
