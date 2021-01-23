import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Item, ItemDto } from '../model/item';

@Injectable({ providedIn: 'root' })
export class ItemService {
  constructor(private http: HttpClient) { }

  addOne(item: ItemDto): Observable<ItemDto> {
    return this.http.post<ItemDto>('http://localhost:8080/items', item);
  }

  findItemsByProduct(productId: number): Observable<ItemDto[]> {
    return this.http.get<ItemDto[]>(`http://localhost:8080/items/product/${productId}`);
  }

  findProductsByNameOrBrand(query: string): Observable<Item[]> {
    return this.http.get<Item[]>(`http://localhost:8080/items/search?brandOrProductName=${query}`);
  }

  getUnits(): Observable<string[]> {
    return of(['g', 'kg', 'mL', 'cL', 'L', 'un']);
  }
}
