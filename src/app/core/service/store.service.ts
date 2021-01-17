import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Store } from '../model/store';

@Injectable({ providedIn: 'root' })
export class StoreService {
  constructor(private http: HttpClient) { }
  
  findStoresByName(query: string): Observable<Store[]> {
    return this.http.get<Store[]>(`http://localhost:8080/stores/search?partialName=${query}`)
  }
}
