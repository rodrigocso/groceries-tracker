import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ItemService } from '../service/item.service';

@Injectable({ providedIn: 'root' })
export class ItemUnitsResolver implements Resolve<string[]> {
  constructor(private itemService: ItemService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<string[]> {
    return this.itemService.getUnits();
  }
}
