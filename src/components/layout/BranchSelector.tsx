import React, { useEffect, useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { branchService, Branch } from '@/services/branchService';

export const BranchSelector = () => {
  const { businessId, branchId, setBranchId } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      if (!businessId) return;
      setLoading(true);
      try {
        const data = await branchService.getBranches(businessId);
        setBranches(data);
      } catch (error) {
        console.error('Failed to fetch branches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [businessId]);

  const currentBranch = branches.find(b => b.id === branchId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto py-1 px-2 border hover:bg-accent flex items-center gap-2">
          <MapPin className="h-3 w-3 text-primary" />
          <div className="text-left">
            <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none">Branch</p>
            <p className="text-xs font-bold leading-tight">{currentBranch?.name || 'Loading...'}</p>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Branch</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {branches.map((branch) => (
          <DropdownMenuItem 
            key={branch.id} 
            className="flex items-center justify-between"
            onClick={() => setBranchId(branch.id)}
          >
            <div className="flex flex-col">
              <span className="font-medium text-sm">{branch.name}</span>
              <span className="text-[10px] text-muted-foreground">{branch.address || 'No address'}</span>
            </div>
            {branchId === branch.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
        {branches.length === 0 && !loading && (
          <DropdownMenuItem disabled>No branches available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
