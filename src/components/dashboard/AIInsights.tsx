import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  AlertCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { geminiService } from '@/services/geminiService';
import { mockProducts, mockCustomers } from '@/constants/mockData';
import { Badge } from '@/components/ui/badge';

interface Insight {
  title: string;
  insight: string;
  impact: 'High' | 'Medium' | 'Low';
}

export const AIInsights = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const context = `
        Business: Barber/Service Shop Demo
        Inventory: ${mockProducts.length} items
        Customers: ${mockCustomers.length} total
        Stats: Recent sales are up 12.5%, bookings at 148, membership active 42.
        Common Products: ${mockProducts.slice(0, 3).map(p => p.name).join(', ')}
      `;
      const result = await geminiService.getBusinessInsights(context);
      setInsights(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2 text-primary font-bold">
            <Sparkles className="h-5 w-5" />
            AI Business Insights
          </CardTitle>
          <CardDescription>Intelligent recommendations based on your data.</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={fetchInsights}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
            <p className="text-sm text-muted-foreground animate-pulse font-medium">Gemini is analyzing your business metrics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((item, index) => (
              <div 
                key={index} 
                className="p-4 rounded-xl bg-background border flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Lightbulb className="h-12 w-12" />
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                  <Badge 
                    variant={item.impact === 'High' ? 'default' : 'secondary'}
                    className={`text-[10px] px-1.5 py-0 ${
                      item.impact === 'High' ? 'bg-primary' : 
                      item.impact === 'Medium' ? 'bg-amber-500 hover:bg-amber-600 border-none text-white' : 
                      'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.impact} Impact
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {item.insight}
                </p>
                <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase tracking-wider mt-2">
                  <TrendingUp className="h-3 w-3" />
                  Recommended Action
                </div>
              </div>
            ))}
            {insights.length === 0 && !loading && (
              <div className="col-span-full py-8 text-center text-muted-foreground italic flex flex-col items-center gap-2">
                <AlertCircle className="h-8 w-8 opacity-20" />
                No insights available right now.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
