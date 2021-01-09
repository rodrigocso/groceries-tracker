import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisitComponent } from './component/visit/visit.component';

const routes: Routes = [
  {
    path: '',
    component: VisitComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitRoutingModule { }
