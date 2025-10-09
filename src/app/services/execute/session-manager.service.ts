import { inject, Injectable } from '@angular/core';
import { UserManagerService } from './user-manager.service';
import { Router } from '@angular/router';
import { GeneralRoutes } from '../../enum/routes.enum';
import { SpinnerService } from './spinner.service';
import { LoginResponse } from '../../interface/api.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionManagerService {

  private readonly _userManagerService: UserManagerService = inject(UserManagerService);
  private readonly _spinnerService: SpinnerService = inject(SpinnerService);
  private readonly _router: Router = inject(Router);

  evaluateSession(): void  {

    this._spinnerService.show();
    this._userManagerService.evaluateAuthentication();

    if (this._userManagerService.isUserAuthenticated())
      this._router.navigate([GeneralRoutes.HOME]).finally((): void => this._spinnerService.hide());

    this._spinnerService.hide();
  }

  postLogin(response: LoginResponse): void {

    this._userManagerService.saveSession(response);

    if (!this._userManagerService.isUserAuthenticated()) return;

    this._spinnerService.show();
    this._router.navigate([GeneralRoutes.HOME]).finally((): void => this._spinnerService.hide());

  }

}
