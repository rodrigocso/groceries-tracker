import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { Item } from '../../core/model/item';
import { Purchase } from '../../core/model/purchase';
import { Store } from '../../core/model/store';

@Injectable()
export class VisitService {
  constructor(private http: HttpClient) { }
  
  findProductsByNameOrBrand(query: string): Observable<Item[]> {
    return this.http.get<Item[]>(`http://localhost:8080/items/search?brandOrProductName=${query}`);
  }

  findStoresByName(query: string): Observable<Store[]> {
    return this.http.get<Store[]>(`http://localhost:8080/stores/search?partialName=${query}`)
  }

  findPurchasesByStoreAndDate(storeId: number, date: moment.Moment): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`http://localhost:8080/purchases/${storeId}/${date.format('yyyyMMDD')}`);
  }
}
