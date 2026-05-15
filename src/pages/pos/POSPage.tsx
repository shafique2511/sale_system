import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  QrCode,
  User,
  Loader2,
  RefreshCw,
  Store,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { inventoryService, Product, Service } from '@/services/inventoryService';
import { posService } from '@/services/posService';
import { customerService } from '@/services/customerService';
import { useAuth } from '@/hooks/useAuth';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'service';
}

export const POSPage = () => {
  const { businessId, branchId, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [productsData, servicesData, customersData] = await Promise.all([
        inventoryService.getProducts(businessId),
        inventoryService.getServices(businessId),
        customerService.getCustomers(businessId)
      ]);
      setProducts(productsData);
      setServices(servicesData);
      setCustomers(customersData);
    } catch (error) {
      toast.error('Failed to fetch items');
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

  const categories = ['All', ...new Set(allItems.map(item => item.category).filter(Boolean))];

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: any) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(i => i.id === item.id);
      if (existingItem) {
        return currentCart.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...currentCart, { 
        id: item.id, 
        name: item.name, 
        price: Number(item.selling_price || item.price), 
        quantity: 1,
        type: item.type
      }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (id: string) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(currentCart => currentCart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  const handleCheckout = async (method: string) => {
    if (!businessId || !branchId || !user) {
      toast.error('Auth context missing');
      return;
    }
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setProcessing(true);
    try {
      await posService.createOrder({
        business_id: businessId,
        branch_id: branchId,
        staff_id: user.id,
        customer_id: selectedCustomer?.id || null,
        total_amount: total,
        tax_amount: tax,
        payment_method: method,
        status: 'completed'
      }, cart.map(item => ({
        [item.type === 'product' ? 'product_id' : 'service_id']: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      })));

      toast.success(`Payment successful! Total: $${total.toFixed(2)}`);
      setCart([]);
      fetchData(); // Refresh stock
    } catch (error: any) {
      toast.error('Payment failed: ' + error.message);
    } finally {
      setProcessing(false);
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
    <div className="flex flex-col h-full min-h-[calc(100vh-10rem)] gap-4 md:gap-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Point of Sale</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} className="h-8 text-xs">
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Refresh
          </Button>
          <div className="relative">
            <Button 
              variant={selectedCustomer ? "default" : "outline"} 
              size="sm" 
              className="gap-2 h-8 text-xs"
              onClick={() => setShowCustomerSearch(!showCustomerSearch)}
            >
              <User className="h-3 w-3" />
              <span className="max-w-[100px] truncate">
                {selectedCustomer ? selectedCustomer.name : 'Select Customer'}
              </span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
            {showCustomerSearch && (
              <div className="absolute right-0 mt-2 w-72 bg-popover border rounded-lg shadow-xl z-50 p-2 animate-in fade-in zoom-in-95">
                <Input 
                  placeholder="Search customer name..." 
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="mb-2"
                  autoFocus
                />
                <ScrollArea className="h-48">
                  <div className="space-y-1">
                    {customers
                      .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()))
                      .map(customer => (
                        <button
                          key={customer.id}
                          className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors flex justify-between items-center"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowCustomerSearch(false);
                            setCustomerSearch('');
                          }}
                        >
                          <span>{customer.name}</span>
                          <Badge variant="secondary" className="text-[10px]">{customer.points} pts</Badge>
                        </button>
                      ))}
                    {customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())).length === 0 && (
                      <p className="text-center text-xs text-muted-foreground py-4">No customers found</p>
                    )}
                  </div>
                </ScrollArea>
                {selectedCustomer && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-2 text-xs text-destructive"
                    onClick={() => {
                      setSelectedCustomer(null);
                      setShowCustomerSearch(false);
                    }}
                  >
                    Clear Selection
                  </Button>
                )}
              </div>
            )}
          </div>
          <Badge variant="secondary" className="px-3 py-1">Terminal #01</Badge>
        </div>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row gap-6 overflow-hidden">
        {/* Product Selection */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products or services..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ScrollArea className="w-full md:w-auto">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-fit">
                <TabsList className="justify-start">
                  {categories.map(cat => (
                    <TabsTrigger key={cat} value={cat} className="whitespace-nowrap">{cat}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </ScrollArea>
          </div>

          <ScrollArea className="flex-1 pr-0 md:pr-4">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 pb-4">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="cursor-pointer hover:border-primary transition-all active:scale-95 hover:bg-accent group overflow-hidden"
                  onClick={() => addToCart(item)}
                >
                  <div className="aspect-square sm:aspect-video bg-muted relative overflow-hidden flex items-center justify-center">
                    <Store className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground group-hover:scale-110 transition-transform" />
                    <Badge className="absolute top-2 right-2 bg-background/80 text-foreground backdrop-blur-sm text-[10px] sm:text-xs">
                      ${((item as any).selling_price || (item as any).price || 0).toFixed(2)}
                    </Badge>
                    {item.type === 'product' && (
                      <Badge variant={item.stock_quantity > 5 ? 'secondary' : 'destructive'} className="absolute bottom-2 left-2 text-[8px] sm:text-[10px]">
                        Stock: {item.stock_quantity}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-2 sm:p-4">
                    <p className="font-semibold text-xs sm:text-sm truncate">{item.name}</p>
                    <div className="mt-1 flex items-center justify-between gap-1">
                      <span className="text-[10px] text-muted-foreground truncate">{item.category}</span>
                      <span className="capitalize px-1 py-0 bg-muted rounded text-[8px] sm:text-[10px] shrink-0 font-medium">{item.type === 'service' ? 'SVC' : 'PRD'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredItems.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  <p>No items found matching your filters.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Cart - Desktop Sidebar */}
        <div className="hidden xl:flex w-96 flex-col overflow-hidden">
          <CartDisplay 
            cart={cart} 
            processing={processing} 
            removeFromCart={removeFromCart} 
            updateQuantity={updateQuantity} 
            subtotal={subtotal} 
            tax={tax} 
            total={total} 
            handleCheckout={handleCheckout} 
          />
        </div>

        {/* Mobile Cart Floating Button */}
        <div className="xl:hidden fixed bottom-6 right-6 z-40">
          <Sheet>
            <SheetTrigger>
              <Button size="lg" className="rounded-full h-14 w-14 shadow-2xl relative">
                <ShoppingCart className="h-6 w-6" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 rounded-full border-2 border-background">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-xl">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your Order
                </SheetTitle>
              </SheetHeader>
              <div className="h-full overflow-hidden flex flex-col">
                <CartDisplay 
                  cart={cart} 
                  processing={processing} 
                  removeFromCart={removeFromCart} 
                  updateQuantity={updateQuantity} 
                  subtotal={subtotal} 
                  tax={tax} 
                  total={total} 
                  handleCheckout={handleCheckout} 
                  isMobile
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

interface CartDisplayProps {
  cart: CartItem[];
  processing: boolean;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  subtotal: number;
  tax: number;
  total: number;
  handleCheckout: (method: string) => void;
  isMobile?: boolean;
}

const CartDisplay = ({ 
  cart, 
  processing, 
  removeFromCart, 
  updateQuantity, 
  subtotal, 
  tax, 
  total, 
  handleCheckout,
  isMobile
}: CartDisplayProps) => {
  return (
    <Card className={cn("flex flex-col overflow-hidden border-2 border-primary/10 h-full", !isMobile && "shadow-sm", isMobile && "border-none shadow-none")}>
      {!isMobile && (
        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <ShoppingCart className="h-4 w-4" />
            Current Order
          </div>
          <Badge variant="outline">{cart.length} items</Badge>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 p-3 rounded-lg border group animate-in slide-in-from-right-2 bg-card">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} / unit</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={() => removeFromCart(item.id)}
                    disabled={processing}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1 border rounded-md">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)} disabled={processing}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)} disabled={processing}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className={cn("p-4 md:p-6 border-t bg-card space-y-4", isMobile && "pb-8")}>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (7%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            className="col-span-2 h-12 gap-2 text-lg font-bold" 
            onClick={() => handleCheckout('Cash')}
            disabled={cart.length === 0 || processing}
          >
            {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Banknote className="h-5 w-5" />}
            {processing ? 'Processing...' : 'Pay Cash'}
          </Button>
          <Button 
            variant="outline" 
            className="h-12 gap-2" 
            onClick={() => handleCheckout('Card')}
            disabled={cart.length === 0 || processing}
          >
            <CreditCard className="h-4 w-4" />
            Card
          </Button>
          <Button 
            variant="outline" 
            className="h-12 gap-2" 
            onClick={() => handleCheckout('QR Scan')}
            disabled={cart.length === 0 || processing}
          >
            <QrCode className="h-4 w-4" />
            QR Pay
          </Button>
        </div>
      </div>
    </Card>
  );
};
