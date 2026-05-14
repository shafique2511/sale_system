import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { seedService } from '@/services/seedService';
import { businessService } from '@/services/businessService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Store, Rocket, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export const OnboardingPage = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [mode, setMode] = useState<'selection' | 'create'>('selection');

  const handleSeedData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await seedService.seedDemoData(user.id, user.email || 'user@example.com');
      await refreshProfile();
      toast.success('Demo business created with example data!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Failed to create demo business: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const business = await businessService.createBusiness(businessName, businessType);
      await businessService.createBranch(business.id, 'Main Branch', true);
      
      // Update profile is usually done in a trigger or manually
      // Here we assume the RLS allows manual profile update for the user
      // or we just call the seed logic partially.
      // For simplicity, let's just use the seed logic shell but without mock items
      // But wait, it's better to just seed for now or implement a full setup.
      // Let's stick to seeding for "Demo Mode" and a basic setup for "Real Mode".
      alert('Manual setup coming soon! For now, please use Demo Mode to explore.');
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Let's set up your business.</h1>
          <p className="text-lg text-muted-foreground">
            OmniBiz is ready to transform how you manage your membership, booking, and POS. 
            Choose how you want to start.
          </p>
          
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-card border shadow-sm">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">Demo Mode</h3>
                <p className="text-sm text-muted-foreground">Populate your workspace with example products, bookings, and customers to explore all features instantly.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-xl bg-card border shadow-sm">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Store className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold">Professional Setup</h3>
                <p className="text-sm text-muted-foreground">Start with a clean slate and configure your business from scratch.</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="shadow-xl border-2 border-primary/5">
            <CardHeader>
              <CardTitle>Welcome to OmniBiz</CardTitle>
              <CardDescription>Select an option to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mode === 'selection' ? (
                <div className="flex flex-col gap-3">
                  <Button 
                    variant="default" 
                    className="h-16 text-lg gap-2" 
                    onClick={handleSeedData}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="h-5 w-5" />}
                    Start with Demo Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 text-lg gap-2"
                    onClick={() => setMode('create')}
                    disabled={loading}
                  >
                    <Store className="h-5 w-5" />
                    Configure New Business
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleCreateBusiness} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Business Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. The Coffee Corner" 
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Business Type</Label>
                    <Input 
                      id="type" 
                      placeholder="e.g. Cafe, Barber Shop, Gym" 
                      value={businessType}
                      onChange={e => setBusinessType(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setMode('selection')}>Back</Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                      Create Business
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
            <CardFooter className="bg-muted/30 text-[10px] text-center justify-center p-4">
              By continuing, you agree to our terms of service and privacy policy.
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
