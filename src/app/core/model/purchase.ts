import { Item } from './item';

export interface Purchase {
  id: number;
  storeId: number;
  transactionDate: string;
  item: Item;
  quantity: number;
  price: number;
}

export interface PurchaseDto {
  id: number;
  storeId: number;
  transactionDate: string;
  itemId: number;
  quantity: number;
  price: number;
}
