import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainFrameComponent } from './view/private/main-frame/main-frame.component';
import { LoginComponent } from './view/public/login/login.component';
import { NotLoggedGuard } from './guards/not-logged.guard';
import { LoggedGuard } from './guards/logged.guard';
import { MenuListResolver } from './resolver/menu-list.resolver';
import { ProfileComponent } from './view/private/profile/profile.component';
import { WelcomeComponent } from './view/private/welcome/welcome.component';

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
        path: 'administrator',
        loadChildren: () => import('./modules/administrator/administrator.module').then(module => module.AdministratorModule),
      },
      {
        path: 'categories',
        loadChildren: () => import('./modules/category/category.module').then(module => module.CategoryModule),
      },
      {
        path: 'users',
        loadChildren: () => import('./modules/customer/customer.module').then(module => module.CustomerModule),
      },
      {
        path: 'orders',
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
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: '',
        component: WelcomeComponent
      }
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
