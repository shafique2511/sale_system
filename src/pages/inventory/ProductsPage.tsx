import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Tag, 
  Filter,
  MoreVertical,
  Image as ImageIcon,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { inventoryService, Product, Service } from '@/services/inventoryService';
import { toast } from 'sonner';

export const ProductsPage = () => {
  const { businessId } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  // Quick Add state
  const [quickName, setQuickName] = useState('');
  const [quickPrice, setQuickPrice] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchData = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [p, s] = await Promise.all([
        inventoryService.getProducts(businessId),
        inventoryService.getServices(businessId)
      ]);
      setProducts(p);
      setServices(s);
    } catch (error) {
      toast.error('Failed to load catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [businessId]);

  const allItems = [
    ...products.map(p => ({ ...p, type: 'product' as const })),
    ...services.map(s => ({ ...s, type: 'service' as const, selling_price: s.price }))
  ];

  const filteredItems = allItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuickAdd = async () => {
    if (!businessId || !quickName || !quickPrice) return;
    setAdding(true);
    try {
      await inventoryService.createProduct({
        business_id: businessId,
        name: quickName,
        selling_price: parseFloat(quickPrice),
        cost_price: parseFloat(quickPrice) * 0.6,
        stock_quantity: 10,
        category: 'Product',
        is_active: true
      });
      toast.success('Product created!');
      setQuickName('');
      setQuickPrice('');
      fetchData();
    } catch (error: any) {
      toast.error('Failed to create: ' + error.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products & Services</h1>
          <p className="text-muted-foreground">Manage your catalog of items and professional services.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Product
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search catalog..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2 ml-auto">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="border rounded-lg bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product/Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="group cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted rounded flex items-center justify-center overflow-hidden border">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{item.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="font-bold text-primary">
                      ${(item as any).selling_price?.toFixed(2) || (item as any).price?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{item.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stats</CardTitle>
              <CardDescription>Composition of your catalog.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Products', count: products.length },
                  { name: 'Services', count: services.length }
                ].map((stat) => (
                  <div key={stat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-3 w-3 rounded-full bg-primary/20 border border-primary/40" />
                      {stat.name}
                    </div>
                    <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded">
                      {stat.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Quick Add Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Name</label>
                  <Input 
                    placeholder="Enter product name" 
                    className="bg-background" 
                    value={quickName}
                    onChange={e => setQuickName(e.target.value)}
                  />
                </div>
                <div>
                   <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Price ($)</label>
                   <Input 
                    placeholder="0.00" 
                    type="number" 
                    className="bg-background" 
                    value={quickPrice}
                    onChange={e => setQuickPrice(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full mt-2" 
                  onClick={handleQuickAdd}
                  disabled={adding || !quickName || !quickPrice}
                >
                  {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Record'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
