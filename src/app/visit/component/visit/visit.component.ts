import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import { Item } from '../../../core/model/item';
import { Purchase } from '../../../core/model/purchase';
import { Store } from '../../../core/model/store';
import { VisitService } from '../../service/visit.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Searchable } from '../../../core/model/searchable';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss']
})
export class VisitComponent implements OnDestroy, OnInit {
  componentDestroyed$ = new Subject();
  itemCtrl = new FormControl();
  items$ = new Observable<Item[]>();
  storeCtrl = new FormControl();
  stores$ = new Observable<Store[]>();
  purchases$ = new Observable<Purchase[]>();
  transactionDateCtrl = new FormControl();

  constructor(private visitService: VisitService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.itemCtrl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(inputValue => typeof inputValue === 'string'),
        takeUntil(this.componentDestroyed$)
      ).subscribe(query => {
        this.items$ = this.visitService.findProductsByNameOrBrand(query);
      });

    this.transactionDateCtrl.valueChanges
      .pipe(
        filter(inputValue => moment.isMoment(inputValue)),
        takeUntil(this.componentDestroyed$)
      ).subscribe(date => {
        if (this.storeCtrl.value) {
          this.purchases$ = this.visitService
            .findPurchasesByStoreAndDate(this.storeCtrl.value.id, date);
        }
      });

    this.storeCtrl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.componentDestroyed$)
      ).subscribe((value: string | Store) => {
        if (typeof value === 'string') {
          this.stores$ = this.visitService.findStoresByName(value);
        } else if (moment.isMoment(this.transactionDateCtrl.value)) {
          this.purchases$ = this.visitService
            .findPurchasesByStoreAndDate(this.storeCtrl.value.id, this.transactionDateCtrl.value);
        }
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  getFetchItemsFn(): (query: string) => Observable<Searchable[]> {
    return this.visitService.findProductsByNameOrBrand.bind(this.visitService);
  }

  getProductDescription(item: Item): string {
    return item ? `${item.product.name} ${item.packageSize} ${item.unit}` : '';
  }

  getStoreName(selectedStore: Store): string {
    return selectedStore?.name;
  }

  handleSelection(autocompleteEvent: MatAutocompleteSelectedEvent): void {
    console.log(autocompleteEvent.option.value);
  }
}
