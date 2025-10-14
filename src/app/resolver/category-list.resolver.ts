import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ICategory } from '../interface/model.interface';
import { finalize, Observable } from 'rxjs';
import { CategoryApiService } from '../modules/category/services/transactional/category-api.service';
import { SpinnerService } from '../services/execute/spinner.service';

@Injectable()
export class CategoryListResolver implements Resolve<ICategory[]> {

  private readonly _categoryApiService: CategoryApiService = inject(CategoryApiService);
  private readonly _spinnerService: SpinnerService = inject(SpinnerService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICategory[]> {

    this._spinnerService.show();

    return this._categoryApiService.getAllCategories()
      .pipe(
        finalize((): void => this._spinnerService.hide()),
      )
  }

}
