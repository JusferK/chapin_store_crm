import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAdministratorComponent } from './pages/list-administrator/list-administrator.component';
import { AdministratorResolver } from './resolver/get-all-admin.resolver';

const routes: Routes = [
  {
    path: '',
    component: ListAdministratorComponent,
    resolve: {
      administratorList: AdministratorResolver,
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
