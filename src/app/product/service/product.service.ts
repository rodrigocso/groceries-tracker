import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../../core/model/product';
import { Brand } from '../../core/model/brand';

@Injectable()
export class ProductService {
  constructor(private http: HttpClient) { }

  addOne(product: Product): Observable<Product> {
    return this.http.post<Product>('http://localhost:8080/products', product);
  }
  
  findProductsByNameAndBrandId(brand: Brand, query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`http://localhost:8080/products/brand/${brand.id}/search?partialName=${query}`);
  }
}
