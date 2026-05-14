import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Gift, 
  Tag, 
  Coffee, 
  Scissors, 
  Star,
  MoreVertical,
  Ticket
} from 'lucide-react';

const mockRewards = [
  { 
    id: '1', 
    name: 'Free Espresso', 
    cost: 350, 
    type: 'Product', 
    icon: Coffee,
    description: 'Any hot or iced espresso-based drink.',
    available: 12,
    color: 'text-amber-600 bg-amber-500/10 border-amber-500/20'
  },
  { 
    id: '2', 
    name: '$10 Discount', 
    cost: 1000, 
    type: 'Voucher', 
    icon: Tag,
    description: 'Flat $10 discount on any service above $30.',
    available: 48,
    color: 'text-green-600 bg-green-500/10 border-green-500/20'
  },
  { 
    id: '3', 
    name: 'Free Beard Trim', 
    cost: 1500, 
    type: 'Service', 
    icon: Scissors,
    description: 'Complimentary beard trim or shape-up service.',
    available: 8,
    color: 'text-blue-600 bg-blue-500/10 border-blue-500/20'
  },
  { 
    id: '4', 
    name: 'VIP Haircare Kit', 
    cost: 3000, 
    type: 'Product', 
    icon: Gift,
    description: 'Full set of premium shampoo, conditioner, and wax.',
    available: 3,
    color: 'text-purple-600 bg-purple-500/10 border-purple-500/20'
  },
];

export const RewardsPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reward Catalog</h1>
          <p className="text-muted-foreground">Manage the items and discounts users can redeem with points.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Reward
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockRewards.map((reward) => (
          <Card key={reward.id} className="group relative flex flex-col hover:border-primary/50 transition-all overflow-hidden">
            <div className="p-12 flex items-center justify-center bg-muted/30 group-hover:bg-primary/5 transition-colors">
              <reward.icon className={cn("h-16 w-16 opacity-80 group-hover:scale-110 transition-transform", reward.color.split(' ')[0])} />
            </div>
            <CardHeader className="pt-4">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className={reward.color}>{reward.type}</Badge>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                  {reward.cost}
                </div>
              </div>
              <CardTitle className="mt-2 text-lg">{reward.name}</CardTitle>
              <CardDescription className="text-xs line-clamp-2">{reward.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto border-t p-4 flex justify-between items-center bg-card">
              <span className="text-xs text-muted-foreground">{reward.available} in shelf</span>
              <Button variant="ghost" size="sm" className="h-8">Configure</Button>
            </CardFooter>
          </Card>
        ))}

        <button className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4 hover:bg-accent transition-all min-h-[300px]">
           <Ticket className="h-12 w-12 text-muted-foreground opacity-20" />
           <p className="text-sm font-medium text-muted-foreground">Add New Reward Tier</p>
        </button>
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';
