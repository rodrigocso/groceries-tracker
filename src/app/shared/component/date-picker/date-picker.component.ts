import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() formControl = new FormControl();
  @Input() label = '';

  componentDestroyed$ = new Subject();

  inputCtrl = new FormControl();
  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnInit(): void {
    this.inputCtrl.setValidators(this.formControl.validator);
    this.inputCtrl.valueChanges
      .pipe(
        debounceTime(300),
        filter(val => moment.isMoment(val)),
        takeUntil(this.componentDestroyed$)
      )
      .subscribe((val: moment.Moment) => {
        this.writeValue(val.format('yyyyMMDD'));
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  writeValue(date: string): void {
    this.onChange(date);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.inputCtrl.disable();
    } else {
      this.inputCtrl.enable();
    }
  }
}
