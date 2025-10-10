import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { UserManagerService } from '../services/execute/user-manager.service';
import { GeneralRoutes } from '../enum/routes.enum';

@Injectable()
export class NotLoggedGuard implements CanActivate {

  private readonly _userManagerService: UserManagerService = inject(UserManagerService);
  private readonly _router: Router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this._userManagerService.isUserAuthenticated()) {
      this._router.navigate([GeneralRoutes.HOME])
        .finally((): void => {});

      return false;
    }

    return true;
  }

}
