export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  stock: number;
  mainImage: string;
  hovering: string;
  detailImages: string[];
  category: 'man' | 'woman' | string;
  category2?: string;
  gender?: string;
  gender2?: string;
  isFeatured: boolean;
  underVideo?: boolean;
  description?: string;
  sizes?: string[];
  colors?: string[];
}
