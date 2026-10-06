export interface ProductCard {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  image: string;
  category?: string;
  reviews?: Array<{ author: string; body: string; rating: number }>;
}

export function toPublicProduct(product: {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  image: string;
  category: string;
}): ProductCard {
  return {
    id: product.id,
    name: product.name,
    shortDescription: product.shortDescription,
    price: product.price,
    image: product.image,
    category: product.category,
  };
}

export function toPublicReview(review: { author: string; body: string; rating: number }): {
  author: string;
  body: string;
  rating: number;
} {
  return { author: review.author, body: review.body, rating: review.rating };
}
