import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Item } from '../../../core/model/item';
import { Purchase } from '../../../core/model/purchase';
import { Store } from '../../../core/model/store';
import { Router } from '@angular/router';
import { ItemService } from '../../../core/service/item.service';
import { StoreService } from '../../../core/service/store.service';
import { PurchaseService } from '../../../core/service/purchase.service';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss']
})
export class VisitComponent implements OnDestroy, OnInit {
  componentDestroyed$ = new Subject();
  purchases$: Observable<Purchase[]> = EMPTY;
 
  itemCtrl = new FormControl(null, Validators.required);
  priceCtrl = new FormControl(null, Validators.required);
  quantityCtrl = new FormControl(null, Validators.required);
  storeCtrl = new FormControl(null, Validators.required);
  transactionDateCtrl = new FormControl(null, Validators.required);

  purchaseForm = this.fb.group({
    itemId: this.itemCtrl,
    price: this.priceCtrl,
    quantity: this.quantityCtrl,
    storeId: this.storeCtrl,
    transactionDate: this.transactionDateCtrl
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private itemService: ItemService,
    private purchaseService: PurchaseService,
    private storeService: StoreService) { }

  get fetchItemsFn(): (query: string) => Observable<Item[]> {
    return this.itemService.findProductsByNameOrBrand.bind(this.itemService);
  }

  get fetchStoresFn(): (query: string) => Observable<Store[]> {
    return this.storeService.findStoresByName.bind(this.storeService);
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
          this.purchaseService.findPurchasesByStoreAndDate(storeId, date);
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
    this.purchaseService.addOne(this.purchaseForm.value).subscribe(purchase => {
      this.purchases$ = this.purchaseService
        .findPurchasesByStoreAndDate(purchase.storeId, purchase.transactionDate);
      
      this.itemCtrl.reset();
      this.quantityCtrl.reset();
      this.priceCtrl.reset();
    });
  }
}
