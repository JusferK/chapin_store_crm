import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductRoutingModule } from './product-routing.module';
import { ListComponent } from './pages/list/list.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ProductListResolver } from './resolver/product-list.resolver';
import { ComponentInitializerResolver } from '../../resolver/component-initializer.resolver';
import { CategoryListResolver } from '../../resolver/category-list.resolver';
import { IMaskDirective } from "angular-imask";

@NgModule({
  declarations: [
    ListComponent,
    ProductFormComponent,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    PrimengModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    IMaskDirective,
  ],
  providers: [
    ProductListResolver,
    ComponentInitializerResolver,
    CategoryListResolver,
  ],
})
export class ProductModule { }
