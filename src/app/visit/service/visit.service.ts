import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../../core/model/item';

@Injectable()
export class VisitService {
  constructor(private http: HttpClient) { }
  
  findProductsByNameOrBrand(query: string): Observable<Item[]> {
    return this.http.get<Item[]>(`http://localhost:8080/items/search?brandOrProductName=${query}`);
  }
}