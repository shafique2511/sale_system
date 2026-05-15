import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, Terminal, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export const ConfigBanner = () => {
  const { error } = useAuth();

  if (!error) return null;

  return (
    <div className="p-4 bg-background border-b sticky top-0 z-50 animate-in slide-in-from-top duration-300">
      <Alert variant="destructive" className="max-w-4xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="font-bold">Configuration Issue detected</AlertTitle>
        <AlertDescription className="flex flex-col gap-3 mt-2">
          <p>{error}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open('https://supabase.com', '_blank')}>
              <ExternalLink className="mr-2 h-3 w-3" />
              Go to Supabase
            </Button>
            <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
              Retry Connection
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
