import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DiscountDialogComponent } from './component/discount-dialog/discount-dialog.component';
import { VisitComponent } from './component/visit/visit.component';
import { VisitRoutingModule } from './visit-routing.module';

@NgModule({
  declarations: [
    DiscountDialogComponent,
    VisitComponent
  ],
  imports: [
    SharedModule,
    VisitRoutingModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class VisitModule { }
