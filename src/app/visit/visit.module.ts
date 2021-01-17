import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { VisitComponent } from './component/visit/visit.component';
import { VisitRoutingModule } from './visit-routing.module';

@NgModule({
  declarations: [VisitComponent],
  imports: [
    SharedModule,
    VisitRoutingModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class VisitModule { }
