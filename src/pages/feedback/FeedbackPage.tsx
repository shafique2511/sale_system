import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  MessageSquare, 
  Star, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Loader2,
  Trash2,
  Smile,
  Meh,
  Frown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { feedbackService, Feedback } from '@/services/feedbackService';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

export const FeedbackPage = () => {
  const { businessId, branchId } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await feedbackService.getFeedback(businessId, branchId);
      setFeedbacks(data);
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [businessId, branchId]);

  const handleDelete = async (id: string) => {
    try {
      await feedbackService.deleteFeedback(id);
      setFeedbacks(feedbacks.filter(f => f.id !== id));
      toast.success('Feedback deleted');
    } catch (error) {
      toast.error('Failed to delete feedback');
    }
  };

  const getSentimentIcon = (sentiment: string | null) => {
    switch (sentiment) {
      case 'positive': return <Smile className="h-4 w-4 text-green-500" />;
      case 'neutral': return <Meh className="h-4 w-4 text-yellow-500" />;
      case 'negative': return <Frown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : '0.0';

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Customer Feedback</h1>
          <p className="text-muted-foreground">Monitor and manage customer ratings and reviews.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchFeedback}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{averageRating}</span>
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-4 w-4 ${star <= Math.round(Number(averageRating)) ? 'fill-current' : 'text-muted'}`} 
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Based on {feedbacks.length} reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <Smile className="h-5 w-5 text-green-500" />
                <span className="text-xs font-bold">{feedbacks.filter(f => f.sentiment === 'positive').length}</span>
              </div>
              <div className="flex flex-col items-center">
                <Meh className="h-5 w-5 text-yellow-500" />
                <span className="text-xs font-bold">{feedbacks.filter(f => f.sentiment === 'neutral').length}</span>
              </div>
              <div className="flex flex-col items-center">
                <Frown className="h-5 w-5 text-red-500" />
                <span className="text-xs font-bold">{feedbacks.filter(f => f.sentiment === 'negative').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-500" />
              <span className="text-2xl font-bold">+12%</span>
              <span className="text-xs text-muted-foreground pt-1">improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Feedback
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>
          <CardDescription>
            Most recent customer comments and ratings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No feedback received yet.</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {feedbacks.map((f) => (
                  <div key={f.id} className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors relative group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {f.customer?.full_name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{f.customer?.full_name || 'Anonymous'}</span>
                            <Badge variant="outline" className="text-[10px] h-4">
                              {new Date(f.created_at).toLocaleDateString()}
                            </Badge>
                            {getSentimentIcon(f.sentiment)}
                          </div>
                          <div className="flex text-yellow-500 my-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-3 w-3 ${star <= f.rating ? 'fill-current' : 'text-muted'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-sm mt-2">{f.comment || 'No comment provided.'}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(f.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
