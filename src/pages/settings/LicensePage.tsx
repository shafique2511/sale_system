import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  ShieldCheck, 
  Calendar, 
  User, 
  ExternalLink,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LicensePage = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">License & Activation</h1>
        <p className="text-muted-foreground">Manage your system license and professional installation details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  System Status: Activated
                </CardTitle>
                <CardDescription>Your license is verified and active for internal use.</CardDescription>
              </div>
              <Badge className="bg-green-500 font-bold">LIFETIME ACCESS</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-muted border flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold opacity-60 uppercase tracking-widest text-[10px]">License Key</p>
                <p className="font-mono text-sm">OBIZ-XXXX-YYYY-ZZZZ-8890</p>
              </div>
              <Button variant="outline" size="sm">Copy Key</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  License Owner
                </div>
                <p className="font-bold">Shafique (Business Owner)</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Activation Date
                </div>
                <p className="font-bold">May 14, 2026</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 bg-muted/20 flex items-center justify-between">
             <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertCircle className="h-3 w-3" />
                This system is for internal business use only.
             </div>
             <Button variant="link" size="sm" className="gap-2">
                Support Resources <ExternalLink className="h-3 w-3" />
             </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Installation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Installation ID</p>
                <p className="text-xs font-mono bg-muted p-2 rounded">inst_8892_prod_v1.0.4</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-bold uppercase text-muted-foreground">Software Version</p>
                 <p className="text-xs">v1.2.0 (Stable Release)</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-bold uppercase text-muted-foreground">Update Status</p>
                 <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span className="text-xs font-medium">System is Up to Date</span>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/5 border-amber-500/20">
             <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-amber-600">
                   <Lock className="h-5 w-5" />
                   Security Pin
                </CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">
                   Set an extra security pin for critical admin actions like deleting records or changing license settings.
                </p>
                <Button variant="outline" className="w-full mt-4 h-10 border-amber-500/30 text-amber-700 hover:bg-amber-500/10">Configure PIN</Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
