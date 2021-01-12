import { Component, ContentChild, forwardRef, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EMPTY, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { SearchDisplayDirective } from './search-display.directive';

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
  @ContentChild(SearchDisplayDirective) searchDisplay?: SearchDisplayDirective;

  @Input() label: string = '';
  @Input() fetchFn: (query: string) => Observable<any[]> = () => EMPTY;

  componentDestroyed$ = new Subject();
  disabled = false;
  inputCtrl = new FormControl();
  onChange: any = () => {};
  onTouched: any = () => {};
  searchResults$: Observable<any[]> = EMPTY;
  value?: any;

  get searchDisplayTemplate(): TemplateRef<any> | undefined {
    return this.searchDisplay?.template;
  }

  ngOnInit(): void {
    this.inputCtrl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(value => typeof value === 'string'),
        takeUntil(this.componentDestroyed$)
      ).subscribe(query => {
        this.searchResults$ = this.fetchFn(query);
      })
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
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
  
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
 }
}
