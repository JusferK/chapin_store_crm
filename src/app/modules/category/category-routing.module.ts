import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCategoryComponent } from './pages/list-category/list-category.component';
import { CategoryListResolver } from '../../resolver/category-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: ListCategoryComponent,
    resolve: {
      categories: CategoryListResolver,
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
