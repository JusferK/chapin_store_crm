import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { ListComponent } from './pages/list/list.component';
import { ProductListResolver } from './resolver/product-list.resolver';
import { ComponentInitializerResolver } from '../../resolver/component-initializer.resolver';
import { IProduct } from '../../interface/model.interface';
import { ProductComponentMode, ProductKeyDataNavigation } from './enum/product-module-data-key-navigation.interface';
import { CategoryListResolver } from '../../resolver/category-list.resolver';
import { ProductModuleNavigation } from './enum/product-module-navigation.interface';

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
    component: ProductFormComponent,
    data: {
      mode: ProductComponentMode.CREATE,
    },
    resolve: {
      category: CategoryListResolver,
    },
  },
  {
    path: 'edit',
    component: ProductFormComponent,
    data: {
      key: ProductKeyDataNavigation.PRODUCT_UPDATE_KEY,
      mode: ProductComponentMode.EDIT,
      redirectTo: ProductModuleNavigation.HOME,
    },
    resolve: {
      category: CategoryListResolver,
      product: ComponentInitializerResolver<IProduct>,
    },
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
