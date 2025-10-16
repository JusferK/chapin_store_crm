import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOrdersComponent } from './pages/list-orders/list-orders.component';
import { GetAllOrdersResolver } from './resolver/get-all-orders.resolver';

const routes: Routes = [
  {
    path: '',
    component: ListOrdersComponent,
    resolve: {
      orderList: GetAllOrdersResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {}
