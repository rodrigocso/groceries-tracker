import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Item } from '../../../core/model/item';
import { Purchase, PurchaseDto } from '../../../core/model/purchase';
import { Store } from '../../../core/model/store';
import { ItemService } from '../../../core/service/item.service';
import { StoreService } from '../../../core/service/store.service';
import { PurchaseService } from '../../../core/service/purchase.service';
import { DiscountDialogComponent } from '../discount-dialog/discount-dialog.component';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss']
})
export class VisitComponent implements OnDestroy, OnInit {
  componentDestroyed$ = new Subject();
  purchases$: Observable<Purchase[]> = EMPTY;

  itemCtrl = new FormControl(null, Validators.required);
  priceCtrl = new FormControl(null, [Validators.required, Validators.min(0)]);
  quantityCtrl = new FormControl(null, [Validators.required, Validators.min(0)]);
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
    private dialog: MatDialog,
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

  get itemIdGetter(): (item: Item) => number {
    return (item) => item?.id;
  }

  get storeIdGetter(): (store: Store) => number {
    return (store) => store?.id;
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
    this.itemCtrl.disable();
    this.quantityCtrl.disable();
    this.priceCtrl.disable();

    combineLatest([this.storeCtrl.valueChanges, this.transactionDateCtrl.valueChanges])
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(([storeId, date]: [number, string]) => {
        if (storeId === null || date === null) {
          this.purchases$ = EMPTY;
          this.itemCtrl.disable();
        } else {
          this.purchases$ = this.purchaseService.findPurchasesByStoreAndDate(storeId, date);
          this.itemCtrl.enable();
        }
      });

    this.itemCtrl.statusChanges
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(() => {
        if (this.itemCtrl.valid) {
          this.quantityCtrl.enable();
          this.priceCtrl.enable();
        } else {
          this.quantityCtrl.disable();
          this.priceCtrl.disable();
        }
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  deletePurchase(purchaseId: number): void {
    this.purchaseService.removeOne(purchaseId)
      .subscribe(() => this.purchases$ = this.purchaseService
        .findPurchasesByStoreAndDate(this.storeCtrl.value, this.transactionDateCtrl.value)
      )
  }

  navigateToNewProduct(): void {
    this.router.navigate(['/product']);
  }

  onAddPurchaseClick(): void {
    const purchase: PurchaseDto = this.purchaseForm.value;
    purchase.price = Math.round(purchase.price / purchase.quantity * 100) / 100;

    this.purchaseService.addOne(purchase).subscribe(purchase => {
      this.purchases$ = this.purchaseService
        .findPurchasesByStoreAndDate(purchase.storeId, purchase.transactionDate);

      this.itemCtrl.reset();
      this.quantityCtrl.reset();
      this.priceCtrl.reset();
    });
  }

  showDiscountDialog(): void {
    this.dialog.open(DiscountDialogComponent, { width: '150px' }).afterClosed()
      .subscribe(discount => {
        if (discount) {
          const discounted = Math.round((this.priceCtrl.value - discount) * 100) / 100;
          this.priceCtrl.setValue(Math.max(discounted, 0));
        }
      });
  }
}
