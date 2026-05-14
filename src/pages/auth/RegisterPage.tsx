import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Store, Loader2, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // 2. Create Business Record
      const { data: bizData, error: bizError } = await supabase
        .from('businesses')
        .insert({
          name: businessName,
          type: businessType,
        })
        .select()
        .single();

      if (bizError) throw bizError;

      // 3. Update Profile (Role set to Owner)
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role: 'owner',
          business_id: bizData.id,
        });

      if (profileError) throw profileError;

      toast.success('Business registered successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <Store className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Enroll your Business</CardTitle>
          <CardDescription>
            Join hundreds of shops using OmniBiz for their daily operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Your Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="John Doe" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@business.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input 
                  id="businessName" 
                  placeholder="Urban Cuts & Coffee" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select onValueChange={setBusinessType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="barber">Barber Shop</SelectItem>
                    <SelectItem value="coffee">Coffee Shop</SelectItem>
                    <SelectItem value="hybrid">Hybrid (Barber + Coffee)</SelectItem>
                    <SelectItem value="spa">Spa / Salon</SelectItem>
                    <SelectItem value="other">Other Service Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <p className="text-[10px] text-muted-foreground">Must be at least 8 characters with numbers and symbols.</p>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Get Lifetime Access
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
             <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <Check className="h-3 w-3 text-green-500" /> No Monthly Subscription
             </div>
             <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <Check className="h-3 w-3 text-green-500" /> One-Time License
             </div>
             <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <Check className="h-3 w-3 text-green-500" /> Unlimited Users
             </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <div className="text-sm text-muted-foreground">
            Already have a system?{' '}
            <Link to="/auth/login" className="text-primary hover:underline font-medium">
              Sign In to Dashboard
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
