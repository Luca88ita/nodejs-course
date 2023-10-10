export type CartProduct = {
  id: string;
  price: number;
  qty: number;
  title?: string;
  description?: string;
  imageUrl?: string;
};

export type CartType = {
  products: CartProduct[];
  totalPrice: number;
};
