import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { ListComponent } from './pages/list/list.component';
import { CategoryFormModalComponent } from './components/category-form-modal/category-form-modal.component';
import { ExecuteComponent } from './services/execute/execute.component';


@NgModule({
  declarations: [
    ListComponent,
    CategoryFormModalComponent,
    ExecuteComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule
  ]
})
export class CategoryModule { }
