import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl } from '@angular/forms';
import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import { Item } from '../../../core/model/item';
import { Purchase } from '../../../core/model/purchase';
import { Store } from '../../../core/model/store';
import { VisitService } from '../../service/visit.service';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss']
})
export class VisitComponent implements OnDestroy, OnInit {
  componentDestroyed$ = new Subject();
  purchases$: Observable<Purchase[]> = EMPTY;
 
  itemCtrl = new FormControl();
  storeCtrl = new FormControl();
  transactionDateCtrl = new FormControl();

  form = this.fb.group({
    transactionDate: this.transactionDateCtrl,
    store: this.storeCtrl,
    item: this.itemCtrl
  });

  constructor(private visitService: VisitService, private fb: FormBuilder) { }

  get fetchItemsFn(): (query: string) => Observable<Item[]> {
    return this.visitService.findProductsByNameOrBrand.bind(this.visitService);
  }

  get fetchStoresFn(): (query: string) => Observable<Store[]> {
    return this.visitService.findStoresByName.bind(this.visitService);
  }

  get itemProductNameGetter(): (item: Item) => string {
    return (item) => item.product.name;
  }

  get itemDetailsGetter(): (item: Item) => string {
    return (item) => `${item.product.brand?.name || 'Unbranded'} | ${item.packageSize}${item.unit}`;
  }

  get storeNameGetter(): (store: Store) => string {
    return (store) => store.name;
  }

  get storeCityGetter(): (store: Store) => string {
    return (store) => store.city;
  }

  ngOnInit(): void {
    this.transactionDateCtrl.setValidators((control: AbstractControl): {[key: string]: any} | null => 
      !control.value || moment.isMoment(control.value) ? null : {invalidDate: {value: control.value}}
    );

    combineLatest([this.storeCtrl.valueChanges, this.transactionDateCtrl.valueChanges])
      .pipe(
        takeUntil(this.componentDestroyed$)
      )
      .subscribe((storeAndDate: [Store, moment.Moment]) => {
        this.purchases$ = storeAndDate[0] === null || storeAndDate[1] === null ?
          EMPTY :
          this.visitService.findPurchasesByStoreAndDate(storeAndDate[0].id, storeAndDate[1]);
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
