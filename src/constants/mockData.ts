export const mockProducts = [
  { id: '1', name: 'Espresso', price: 3.50, category: 'Coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=100&h=100&fit=crop', sku: 'COF-ESP', stock_quantity: 150 },
  { id: '2', name: 'Latte', price: 4.50, category: 'Coffee', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=100&h=100&fit=crop', sku: 'COF-LAT', stock_quantity: 120 },
  { id: '3', name: 'Cappuccino', price: 4.00, category: 'Coffee', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=100&h=100&fit=crop', sku: 'COF-CAP', stock_quantity: 100 },
  { id: '4', name: 'Classic Haircut', price: 25.00, category: 'Service', image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=100&h=100&fit=crop', sku: 'SRV-HCT', stock_quantity: 0 },
  { id: '5', name: 'Beard Trim', price: 15.00, category: 'Service', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=100&h=100&fit=crop', sku: 'SRV-BRD', stock_quantity: 0 },
  { id: '6', name: 'Hair Wax', price: 12.00, category: 'Product', image: 'https://images.unsplash.com/photo-1590159763121-7c9ff3149e07?w=100&h=100&fit=crop', sku: 'PRD-WAX', stock_quantity: 45 },
  { id: '7', name: 'Croissant', price: 3.25, category: 'Food', image: 'https://images.unsplash.com/photo-1555507036-ab10bc72bea0?w=100&h=100&fit=crop', sku: 'FOD-CRO', stock_quantity: 24 },
  { id: '8', name: 'Iced Tea', price: 3.50, category: 'Drinks', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100&h=100&fit=crop', sku: 'DRN-TEA', stock_quantity: 80 },
];

export const mockCategories = ['All', 'Coffee', 'Service', 'Product', 'Food', 'Drinks'];

export const mockCustomers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', points: 450, membership: 'Gold VIP', lastVisit: '2 days ago' },
  { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', phone: '+1 987 654 321', points: 120, membership: 'Monthly Pass', lastVisit: '1 week ago' },
  { id: '3', name: 'Mike Ross', email: 'mike@example.com', phone: '+1 555 444 333', points: 890, membership: 'Platinum', lastVisit: 'Today' },
  { id: '4', name: 'Emma Wilson', email: 'emma@example.com', phone: '+1 111 222 333', points: 50, membership: 'None', lastVisit: '2 weeks ago' },
];

export const mockBookings = [
  { id: '1', customer: 'John Doe', service: 'Classic Haircut', staff: 'Alex', time: '10:00 AM', date: 'Today', status: 'confirmed', price: 25 },
  { id: '2', customer: 'Sarah Smith', service: 'Latte & Breakfast', staff: 'None', time: '11:30 AM', date: 'Today', status: 'completed', price: 12.5 },
  { id: '3', customer: 'Mike Ross', service: 'Beard Trim', staff: 'Alex', time: '02:00 PM', date: 'Today', status: 'pending', price: 15 },
  { id: '4', customer: 'David G.', service: 'Hair Coloring', staff: 'Jessica', time: '09:00 AM', date: 'Tomorrow', status: 'confirmed', price: 85 },
];

export const mockStaff = [
  { id: '1', name: 'Alex Thompson', role: 'Senior Barber', branch: 'Main Street', commission: 25, status: 'Active', color: '#3b82f6' },
  { id: '2', name: 'Jessica Miller', role: 'Stylist', branch: 'Main Street', commission: 30, status: 'Active', color: '#ec4899' },
  { id: '3', name: 'Sam Chen', role: 'Barista', branch: 'West End', commission: 15, status: 'Active', color: '#10b981' },
  { id: '4', name: 'Maria Garcia', role: 'Manager', branch: 'All', commission: 0, status: 'On Leave', color: '#f59e0b' },
];
