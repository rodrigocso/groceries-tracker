import { Product } from './product';

export interface Item {
  id: number;
  product: Product;
  packageSize: number;
  unit: string;
}

export interface ItemDto {
  id: number;
  productId: number;
  packageSize: number;
  unit: string;
}