import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUserComponent } from './pages/list-user/list-user.component';
import { CustomerListResolver } from './resolver/customer-list-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: ListUserComponent,
    resolve: {
      customerList: CustomerListResolver,
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
