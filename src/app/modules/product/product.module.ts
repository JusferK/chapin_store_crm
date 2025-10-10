import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ListComponent } from './pages/list/list.component';
import { AddComponent } from './pages/add/add.component';
import { EditComponent } from './pages/edit/edit.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ProductListResolver } from './resolver/product-list.resolver';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    EditComponent,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    PrimengModule,
  ],
  providers: [
    ProductListResolver
  ]
})
export class ProductModule { }
