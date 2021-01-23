import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EMPTY, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

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
export class SearchSelectorComponent<T> implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() action?: 'new' | 'save';
  @Input() alwaysShowLabel = false;
  @Input() formControl = new FormControl();
  @Input() label = '';
  @Input() fetchFn!: (query: string) => Observable<T[]>;
  @Input() outputFn?: (value: T) => any;
  @Input() primaryTextFn!: (value: T) => string;
  @Input() secondaryTextFn?: (value: T) => string;

  @Output() actionClick = new EventEmitter<string>();

  private componentDestroyed$ = new Subject();

  hasSecondaryText = false;
  inputCtrl = new FormControl();
  onChange: any = () => {};
  onTouched: any = () => {};
  searchResults$: Observable<T[]> = EMPTY;
  value?: T;

  ngOnInit(): void {
    this.checkRequiredInput(this.fetchFn, 'fetchFn');
    this.checkRequiredInput(this.primaryTextFn, 'primaryTextFn');
    this.hasSecondaryText = this.secondaryTextFn !== undefined;
    this.inputCtrl.setValidators(this.formControl.validator);
    this.inputCtrl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.componentDestroyed$)
      )
      .subscribe(query => {
        if (!query) {
          this.searchResults$ = EMPTY;
        } else {
          this.searchResults$ = this.fetchFn(query);
        }
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  getSecondaryText(value: T): string | null {
    return this.secondaryTextFn?.(value) || null;
  }

  onOptionSelected(obj: T): void {
    this.onChange(this.outputFn?.(obj) || obj);
    this.value = obj;
    this.inputCtrl.reset();
    this.searchResults$ = EMPTY;
  }

  writeValue(obj: T): void {
    this.value = obj;
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

  private checkRequiredInput(input: any, inputName: string): void {
    if (input === undefined) {
      throw new Error(`${inputName} was not provided.`);
    }
  }
}
