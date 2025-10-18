import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'roles',
        loadChildren: () => import('./modules/rol/rol.module').then(m => m.RolModule),
      },
      {
        path: 'modules',
        loadChildren: () => import('./modules/module/module.module').then(m => m.ModuleModule),
      },
      {
        path: 'operations',
        loadChildren: () => import('./modules/operation/operation.module').then(m => m.OperationModule),
      },
      {
        path: 'permission',
        loadChildren: () => import('./modules/permission/permission.module').then(m => m.PermissionModule),
      },
      {
        path: '**',
        redirectTo: 'roles',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
