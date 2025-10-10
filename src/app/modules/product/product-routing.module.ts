import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './pages/add/add.component';
import { EditComponent } from './pages/edit/edit.component';
import { ListComponent } from './pages/list/list.component';
import { ProductListResolver } from './resolver/product-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    resolve: {
      products: ProductListResolver
    },
  },
  {
    path: 'add',
    component: AddComponent,
  },
  {
    path: 'edit',
    component: EditComponent,
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
