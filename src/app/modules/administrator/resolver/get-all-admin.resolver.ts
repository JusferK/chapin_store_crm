import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { IAdministrator } from '../../../interface/model.interface';
import { finalize, Observable } from 'rxjs';
import { SpinnerService } from '../../../services/execute/spinner.service';
import { AdministratorApiService } from '../services/transactional/administrator-api.service';

@Injectable()
export class AdministratorResolver implements Resolve<IAdministrator[]> {

  private readonly _spinnerService: SpinnerService = inject(SpinnerService);
  private readonly _administratorApiService: AdministratorApiService = inject(AdministratorApiService);

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IAdministrator[]> {

    this._spinnerService.show();

    return this._administratorApiService.getAll()
      .pipe(
        finalize((): void => this._spinnerService.hide()),
      );
  }

}
