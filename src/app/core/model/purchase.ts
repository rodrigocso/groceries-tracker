import { Item } from './item';

export interface Purchase {
  id: number;
  storeId: number;
  transactionDate: string;
  item: Item;
  quantity: number;
  price: number;
}
