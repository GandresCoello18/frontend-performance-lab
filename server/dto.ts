export function publicProduct(product: {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  image: string;
  category: string;
}) {
  return {
    id: product.id,
    name: product.name,
    shortDescription: product.shortDescription,
    price: product.price,
    image: product.image,
    category: product.category,
  };
}

export function publicReview(review: {
  author: string;
  body: string;
  rating: number;
  title: string;
}) {
  return {
    author: review.author,
    title: review.title,
    body: review.body,
    rating: review.rating,
  };
}

export function publicCategory(category: { id: string; name: string }) {
  return { id: category.id, name: category.name };
}
