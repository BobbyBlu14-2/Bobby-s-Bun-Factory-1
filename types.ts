
export type ProductType = 'bun' | 'jar';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: ProductType;
  tags?: string[];
  color: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  modifier?: Product | null;
}

export type OrderType = 'delivery' | 'pickup' | 'shipping';

export interface AppState {
  cart: CartItem[];
  orderType: OrderType;
  zipCode: string;
}
