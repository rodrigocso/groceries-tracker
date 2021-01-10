import { Product } from './product';
import { Searchable } from './searchable';

export class Item implements Searchable {
  id: number;
  product: Product;
  packageSize: number;
  unit: string;

  constructor(item: Item) {
    this.id = item.id;
    this.product = item.product;
    this.packageSize = item.packageSize;
    this.unit = item.unit;
  }

  getDescription(): string {
    return this.product.name;
  }
}
