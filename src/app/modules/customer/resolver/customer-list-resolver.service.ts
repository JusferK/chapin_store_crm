import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from '@angular/router';
import { Pagination } from '../../../interface/pagination.interface';
import { ICustomer, IProduct } from '../../../interface/model.interface';
import { finalize, Observable } from 'rxjs';
import { CustomerApiService } from '../services/transactional/customer-api.service';
import { SpinnerService } from '../../../services/execute/spinner.service';

@Injectable()
export class CustomerListResolver implements Resolve<Pagination<ICustomer[]>> {

  private readonly _customerApiService: CustomerApiService = inject(CustomerApiService);
  private readonly _spinnerService: SpinnerService = inject(SpinnerService);

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Pagination<ICustomer[]>> {

    this._spinnerService.show();

    return this._customerApiService.getAll()
      .pipe(
        finalize(() => this._spinnerService.hide())
      );
  }

}
