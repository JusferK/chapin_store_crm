import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from '@angular/router';
import { Pagination } from '../../../interface/pagination.interface';
import { IOrder } from '../../../interface/model.interface';
import { finalize, Observable } from 'rxjs';
import { OrderApiService } from '../services/transactional/order-api.service';
import { SpinnerService } from '../../../services/execute/spinner.service';

@Injectable()
  export class GetAllOrdersResolver implements Resolve<Pagination<IOrder[]>> {

  private readonly _orderApiService: OrderApiService = inject(OrderApiService);
  private readonly _spinnerService: SpinnerService = inject(SpinnerService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Pagination<IOrder[]>> {

    this._spinnerService.show();

    return this._orderApiService.getAll()
      .pipe(
        finalize((): void => this._spinnerService.hide()),
      );
  }

}
