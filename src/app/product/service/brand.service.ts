import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Brand } from '../../core/model/brand';

@Injectable()
export class BrandService {
  constructor(private http: HttpClient) { }

  addOne(brand: Brand): Observable<Brand> {
    return this.http.post<Brand>('http://localhost:8080/brands', brand);
  }
  
  findBrandsByName(query: string): Observable<Brand[]> {
    return this.http.get<Brand[]>(`http://localhost:8080/brands/search?partialName=${query}`);
  }
}
