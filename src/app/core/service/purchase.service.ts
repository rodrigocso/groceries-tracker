import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Purchase, PurchaseDto } from '../model/purchase';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  constructor(private http: HttpClient) { }

  addOne(purchase: PurchaseDto): Observable<PurchaseDto> {
    return this.http.post<PurchaseDto>('http://localhost:8080/purchases', purchase);
  }
  
  findPurchasesByStoreAndDate(storeId: number, formattedDate: string): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`http://localhost:8080/purchases/store/${storeId}/${formattedDate}`);
  }

  removeOne(purchaseId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/purchases/${purchaseId}`);
  }
}
