import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { ListOrdersComponent } from './pages/list-orders/list-orders.component';
import { GetAllOrdersResolver } from './resolver/get-all-orders.resolver';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusPipe } from './pipes/status.pipe';


@NgModule({
  declarations: [
    ListOrdersComponent,
    StatusPipe,
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    GetAllOrdersResolver,
    StatusPipe,
  ],
})
export class OrderModule { }
