import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemUnitsResolver } from './core/resolver/item-units.resolver';

const routes: Routes = [
  {
    path: 'visit',
    loadChildren: () => import('./visit/visit.module').then(m => m.VisitModule)
  },
  {
    path: 'product',
    loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
    resolve: {
      units: ItemUnitsResolver
    }
  },
  {
    path: '',
    redirectTo: '/visit',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
