import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainFrameComponent } from './view/private/main-frame/main-frame.component';
import { LoginComponent } from './view/public/login/login.component';
import { NotLoggedGuard } from './guards/not-logged.guard';
import { LoggedGuard } from './guards/logged.guard';
import { MenuListResolver } from './resolver/menu-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: MainFrameComponent,
    canActivate: [LoggedGuard],
    resolve: {
      menuList: MenuListResolver
    },
    children: [
      {
        path: 'adminitrator',
        loadChildren: () => import('./modules/administrator/administrator.module').then(module => module.AdministratorModule),
      },
      {
        path: 'category',
        loadChildren: () => import('./modules/category/category.module').then(module => module.CategoryModule),
      },
      {
        path: 'customer',
        loadChildren: () => import('./modules/customer/customer.module').then(module => module.CustomerModule),
      },
      {
        path: 'order',
        loadChildren: () => import('./modules/order/order.module').then(module => module.OrderModule),
      },
      {
        path: 'product',
        loadChildren: () => import('./modules/product/product.module').then(module => module.ProductModule),
      },
      {
        path: 'security',
        loadChildren: () => import('./modules/security/security.module').then(module => module.SecurityModule),
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotLoggedGuard],
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
