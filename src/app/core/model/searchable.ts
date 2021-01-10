import { Product } from './product';

export interface Searchable {
  product: Product;
  packageSize: number;
  unit: string;
  getDescription: () => string;
}