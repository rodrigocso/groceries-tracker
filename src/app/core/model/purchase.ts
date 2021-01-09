import { Item } from './item';
import { Store } from './store';

export interface Purchase {
  id: number;
  store: Store;
  transactionDate: string;
  item: Item;
  quantity: number;
  price: number;
}
