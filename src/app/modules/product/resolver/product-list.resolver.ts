import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Pagination } from '../../../interface/pagination.interface';
import { IProduct } from '../../../interface/model.interface';
import { finalize, Observable } from 'rxjs';
import { ProductApiService } from '../services/transactional/product-api.service';
import { SpinnerService } from '../../../services/execute/spinner.service';

@Injectable()
export class ProductListResolver implements Resolve<Pagination<IProduct[]>> {

  private readonly _productApiService: ProductApiService = inject(ProductApiService);
  private readonly _spinnerService: SpinnerService = inject(SpinnerService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Pagination<IProduct[]>> {

    this._spinnerService.show();

    return this._productApiService.getAllProducts()
      .pipe(
        finalize((): void => this._spinnerService.hide()),
      );
  }

}
