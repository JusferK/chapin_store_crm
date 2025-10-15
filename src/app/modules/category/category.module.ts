import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryFormModalComponent } from './components/category-form-modal/category-form-modal.component';
import { ListCategoryComponent } from './pages/list-category/list-category.component';
import { CategoryListResolver } from '../../resolver/category-list.resolver';
import { PrimengModule } from '../primeng/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CategoryFormModalComponent,
    ListCategoryComponent,
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    PrimengModule,
    ReactiveFormsModule,
  ],
  providers: [
    CategoryListResolver,
  ],
})
export class CategoryModule { }
