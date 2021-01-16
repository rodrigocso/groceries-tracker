import { Brand } from './brand';

export interface Product {
  id?: number;
  name: string;
  brand: Brand;
}

export interface ProductDto {
  id?: number;
  name: string;
  brandId: number;
}
