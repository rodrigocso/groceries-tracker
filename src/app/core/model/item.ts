import { Product } from './product';

export interface Item {
  id: number;
  product: Product;
  packageSize: number;
  unit: string;
}
