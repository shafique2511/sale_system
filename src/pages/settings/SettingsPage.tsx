import React, { useEffect, useState } from 'react';
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
  Plus,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { businessService } from '@/services/businessService';
import { branchService, Branch } from '@/services/branchService';
import { toast } from 'sonner';

export const SettingsPage = () => {
  const { businessId } = useAuth();
  const [business, setBusiness] = useState<any>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [businessData, branchesData] = await Promise.all([
        businessService.getBusinessById(businessId),
        branchService.getBranches(businessId)
      ]);
      setBusiness(businessData);
      setBranches(branchesData);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [businessId]);

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId || !business) return;
    
    setSaving(true);
    try {
      await businessService.updateBusiness(businessId, {
        name: business.name,
        description: business.description,
        email: business.email,
        phone: business.phone,
        website: business.website
      });
      toast.success('Business settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
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
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure your business profile, branches, and system preferences.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
             <RefreshCw className="h-4 w-4 mr-2" />
             Refresh
          </Button>
        </div>
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
          <form onSubmit={handleSaveBusiness}>
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
                      <h3 className="font-bold text-lg leading-tight uppercase tracking-tight">{business?.name || 'Your Brand'}</h3>
                      <p className="text-xs text-muted-foreground">Recommended size: 512x512px. JPG, PNG or SVG.</p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" type="button">Choose File</Button>
                        <Button variant="outline" size="sm" type="button">Remove</Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="biz-name">Business Name</Label>
                      <Input 
                        id="biz-name" 
                        value={business?.name || ''} 
                        onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="biz-type">Sub Heading</Label>
                      <Input id="biz-type" value="Barbershop + Cafe" readOnly />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="biz-desc">Description</Label>
                      <Textarea 
                        id="biz-desc" 
                        placeholder="Tell your customers about your business..."
                        value={business?.description || ''}
                        onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6 bg-muted/20">
                  <Button className="ml-auto" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="biz-email">Public Email</Label>
                    <Input 
                      id="biz-email" 
                      type="email" 
                      value={business?.email || ''} 
                      onChange={(e) => setBusiness({ ...business, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="biz-phone">Public Phone</Label>
                    <Input 
                      id="biz-phone" 
                      value={business?.phone || ''} 
                      onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="biz-web">Website (Optional)</Label>
                    <Input 
                      id="biz-web" 
                      value={business?.website || ''} 
                      onChange={(e) => setBusiness({ ...business, website: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          <div className="grid gap-6">
            {branches.map((branch) => (
              <Card key={branch.id} className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{branch.name}</h3>
                      <Badge variant={branch.is_primary ? 'default' : 'secondary'}>
                        {branch.is_primary ? 'Main' : 'Branch'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{branch.address || 'No address set'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="outline" size="sm">Manage Staff</Button>
                   <Button variant="outline" size="sm">Opening Hours</Button>
                   <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </Card>
            ))}
            {branches.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No branches found.</p>
              </div>
            )}
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
