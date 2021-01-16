import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EditComponent } from './component/edit/edit.component';
import { ProductRoutingModule } from './product-routing.module';
import { BrandService } from './service/brand.service';
import { ItemService } from './service/item.service';
import { ProductService } from './service/product.service';

@NgModule({
  imports: [
    SharedModule,
    ProductRoutingModule
  ],
  exports: [],
  declarations: [EditComponent],
  providers: [
    BrandService,
    ItemService,
    ProductService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProductModule { }
