export const geminiService = {
  async getBusinessInsights(context: string) {
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context })
      });
      
      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    } catch (error) {
      console.error('Error getting business insights:', error);
      return [];
    }
  },

  async askAssistant(question: string, context: string) {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context })
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error asking assistant:', error);
      return "I'm sorry, I encountered an error while processing your request. Please try again soon.";
    }
  }
};
