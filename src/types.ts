export interface ProductCard {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  image: string;
  description?: string;
  reviews?: Array<{ author: string; body: string; rating: number }>;
}
