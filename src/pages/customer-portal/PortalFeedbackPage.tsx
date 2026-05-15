import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { feedbackService } from '@/services/feedbackService';
import { toast } from 'sonner';
import { geminiService } from '@/services/geminiService';

export const PortalFeedbackPage = () => {
  const { profile, businessId, branchId } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      // Analyze sentiment using Gemini
      const sentimentResult = await geminiService.getBusinessInsights(`
        Analyze the sentiment of this customer feedback: "${comment}". 
        Rating: ${rating}/5.
        Return ONLY one word: positive, neutral, or negative.
      `);
      
      const sentiment = sentimentResult.toLowerCase().includes('positive') ? 'positive' :
                        sentimentResult.toLowerCase().includes('negative') ? 'negative' : 'neutral';

      await feedbackService.submitFeedback({
        business_id: businessId!,
        branch_id: branchId!,
        customer_id: profile?.id,
        rating,
        comment,
        sentiment: sentiment as any,
        source: 'direct',
        is_public: true
      });

      setSubmitted(true);
      toast.success('Thank you for your feedback!');
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-500">
        <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Feedback Received!</h2>
        <p className="text-muted-foreground text-center max-w-xs">
          Your input helps us improve our services. We appreciate your time!
        </p>
        <Button 
          variant="outline" 
          className="mt-8"
          onClick={() => {
            setSubmitted(false);
            setRating(0);
            setComment('');
          }}
        >
          Send another feedback
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Rate Your Experience</CardTitle>
          <CardDescription>
            We value your feedback. Let us know how we're doing!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm font-medium">Overall Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 touch-manipulation transition-transform active:scale-90"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star 
                      className={`h-10 w-10 ${
                        (hoverRating || rating) >= star 
                          ? 'fill-yellow-500 text-yellow-500' 
                          : 'text-muted-foreground opacity-30'
                      }`} 
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Comments (Optional)</p>
              <Textarea 
                placeholder="Tell us more about your experience..." 
                className="min-h-[150px] resize-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 gap-2 text-lg font-bold"
              disabled={submitting || rating === 0}
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
