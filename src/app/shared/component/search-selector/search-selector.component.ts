import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EMPTY, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search-selector',
  templateUrl: './search-selector.component.html',
  styleUrls: ['./search-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchSelectorComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class SearchSelectorComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() alwaysShowLabel = false;
  @Input() label = '';
  @Input() fetchFn: (query: string) => Observable<any[]> = () => EMPTY;
  @Input() primaryTextFn: (value: any) => string = (value) => value;
  @Input() secondaryTextFn?: (value: any) => string;

  @Output() addClick = new EventEmitter<string>();

  componentDestroyed$ = new Subject();
  hasSecondaryText = false;
  inputCtrl = new FormControl();
  onChange: any = () => {};
  onTouched: any = () => {};
  searchResults$: Observable<any[]> = EMPTY;
  value?: any;

  ngOnInit(): void {
    this.hasSecondaryText = this.secondaryTextFn !== undefined;
    this.inputCtrl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(value => typeof value === 'string'),
        takeUntil(this.componentDestroyed$)
      )
      .subscribe(query => {
        if (!query) {
          this.searchResults$ = EMPTY;
        } else {
          this.searchResults$ = this.fetchFn(query);
        }
      })
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  getSecondaryText(value: any): string | null {
    return this.secondaryTextFn ? this.secondaryTextFn(value) : null;
  }

  writeValue(obj: any): void {
    this.onChange(obj);
    this.value = obj;
    this.inputCtrl.reset();
    this.searchResults$ = EMPTY;
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
