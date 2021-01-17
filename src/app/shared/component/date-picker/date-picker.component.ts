import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
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
export class DatePickerComponent implements OnInit, ControlValueAccessor {
  @Input() formControl = new FormControl();
  @Input() label = '';

  inputCtrl = new FormControl();
  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnInit(): void {
    this.inputCtrl.setValidators(this.formControl.validator);
    this.inputCtrl.valueChanges
      .pipe()
      .subscribe((val: moment.Moment) => {
        this.writeValue(val.format('yyyyMMDD'));
      })
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
