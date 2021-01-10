import { Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { EMPTY, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Searchable } from '../../../core/model/searchable';
import { SearchDisplayDirective } from './search-display.directive';

@Component({
  selector: 'app-search-selector',
  templateUrl: './search-selector.component.html'
})
export class SearchSelectorComponent implements OnInit, OnDestroy {
  @ContentChild(SearchDisplayDirective) searchDisplay?: SearchDisplayDirective;
  @Input() fetchFn: (query: string) => Observable<Searchable[]> = () => EMPTY;
  @Output() optionSelected = new EventEmitter<Searchable>();

  componentDestroyed$ = new Subject();
  inputCtrl = new FormControl();
  searchResults$: Observable<Searchable[]> = EMPTY;
  selectedItem?: Searchable;

  constructor() { }

  get searchDisplayTemplate(): TemplateRef<any> | undefined {
    return this.searchDisplay?.template;
  }

  get itemTemplateContext(): object {
    return { $implicit: this.selectedItem };
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

  onOptionSelected(e: MatAutocompleteSelectedEvent): void {
    this.optionSelected.emit(e.option.value);
    this.selectedItem = e.option.value;
    this.inputCtrl.reset();
  }
}