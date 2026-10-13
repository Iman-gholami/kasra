export type CategorySlug = "shomiz" | "manto" | "tshirt";
export type Color = { id: string; name: string; hex: string };
export type Variant = {
  id: string;
  color: string;
  size: string;
  stock: number;
};
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAt?: number;
  description: string;
  images: string[];
  colors: Color[];
  sizes: string[];
  variants: Variant[];
  fabric: string;
  fit: string;
  care: string;
  createdAt: string;
  featured: boolean;
};
export type CatalogQuery = {
  category?: string;
  q?: string;
  size?: string;
  color?: string;
  min?: string;
  max?: string;
  available?: string;
  sale?: string;
  sort?: string;
  page?: string;
};
export type CatalogResult = {
  products: Product[];
  total: number;
  page: number;
  pages: number;
};
export interface CatalogAdapter {
  list(query: CatalogQuery): Promise<CatalogResult>;
  get(slug: string): Promise<Product | undefined>;
  byIds(ids: string[]): Promise<Product[]>;
}
