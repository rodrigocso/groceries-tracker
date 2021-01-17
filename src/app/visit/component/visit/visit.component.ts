import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Item } from '../../../core/model/item';
import { Purchase } from '../../../core/model/purchase';
import { Store } from '../../../core/model/store';
import { VisitService } from '../../service/visit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss']
})
export class VisitComponent implements OnDestroy, OnInit {
  componentDestroyed$ = new Subject();
  purchases$: Observable<Purchase[]> = EMPTY;
 
  itemCtrl = new FormControl();
  priceCtrl = new FormControl();
  quantityCtrl = new FormControl();
  storeCtrl = new FormControl();
  transactionDateCtrl = new FormControl();

  purchaseForm = this.fb.group({
    itemId: this.itemCtrl,
    price: this.priceCtrl,
    quantity: this.quantityCtrl,
    storeId: this.storeCtrl,
    transactionDate: this.transactionDateCtrl
  });

  constructor(private visitService: VisitService, private fb: FormBuilder, private router: Router) { }

  get fetchItemsFn(): (query: string) => Observable<Item[]> {
    return this.visitService.findProductsByNameOrBrand.bind(this.visitService);
  }

  get fetchStoresFn(): (query: string) => Observable<Store[]> {
    return this.visitService.findStoresByName.bind(this.visitService);
  }

  get itemProductNameGetter(): (item: Item) => string {
    return (item) => item?.product.name;
  }

  get itemDetailsGetter(): (item: Item) => string {
    return (item) => `${item?.product.brand?.name || 'Unbranded'} | ${item?.packageSize}${item?.unit}`;
  }

  get storeNameGetter(): (store: Store) => string {
    return (store) => store.name;
  }

  get storeCityGetter(): (store: Store) => string {
    return (store) => store.city;
  }

  ngOnInit(): void {
    combineLatest([this.storeCtrl.valueChanges, this.transactionDateCtrl.valueChanges])
      .pipe(
        takeUntil(this.componentDestroyed$)
      )
      .subscribe(([storeId, date]: [number, string]) => {
        this.purchases$ = storeId === null || date === null ?
          EMPTY :
          this.visitService.findPurchasesByStoreAndDate(storeId, date);
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  navigateToNewProduct(): void {
    this.router.navigate(['/product']);
  }

  onAddPurchaseClick(): void {
    console.log(this.purchaseForm.value);
  }
}
