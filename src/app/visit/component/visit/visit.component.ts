import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl } from '@angular/forms';
import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
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

  ngOnInit(): void {
    this.transactionDateCtrl.setValidators((control: AbstractControl): {[key: string]: any} | null => 
      !control.value || moment.isMoment(control.value) ? null : {invalidDate: {value: control.value}}
    );

    combineLatest([this.storeCtrl.valueChanges, this.transactionDateCtrl.valueChanges])
      .pipe(
        distinctUntilChanged((x, y) => (x[0] !== y[0]) || (x[1] !== y[1])),
        takeUntil(this.componentDestroyed$)
      )
      .subscribe((storeAndDate: [Store, moment.Moment]) => {
        this.purchases$ = this.visitService.findPurchasesByStoreAndDate(storeAndDate[0].id, storeAndDate[1]);
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  getFetchItemsFn(): (query: string) => Observable<Item[]> {
    return this.visitService.findProductsByNameOrBrand.bind(this.visitService);
  }

  getFetchStoresFn(): (query: string) => Observable<Store[]> {
    return this.visitService.findStoresByName.bind(this.visitService);
  }
}
