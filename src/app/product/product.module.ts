import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EditComponent } from './component/edit/edit.component';
import { ProductRoutingModule } from './product-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ProductRoutingModule
  ],
  exports: [],
  declarations: [EditComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProductModule { }
