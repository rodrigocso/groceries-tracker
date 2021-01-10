import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { SearchSelectorComponent } from './component/search-selector/search-selector.component';
import { SearchDisplayDirective } from './component/search-selector/search-display.directive';

@NgModule({
  declarations: [
    SearchSelectorComponent,
    SearchDisplayDirective
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SearchSelectorComponent,
    SearchDisplayDirective
  ]
})
export class SharedModule { }
