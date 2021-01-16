import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ItemDto } from '../../core/model/item';

@Injectable()
export class ItemService {
  constructor(private http: HttpClient) { }

  addOne(item: ItemDto): Observable<ItemDto> {
    return this.http.post<ItemDto>('http://localhost:8080/items', item);
  }
  
  findItemsByProduct(productId: number): Observable<ItemDto[]> {
    return this.http.get<ItemDto[]>(`http://localhost:8080/items/product/${productId}`);
  }
}
