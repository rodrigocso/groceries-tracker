import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { DatePickerComponent } from './component/date-picker/date-picker.component';
import { SearchSelectorComponent } from './component/search-selector/search-selector.component';

@NgModule({
  declarations: [
    DatePickerComponent,
    SearchSelectorComponent
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
    DatePickerComponent,
    SearchSelectorComponent
  ]
})
export class SharedModule { }
