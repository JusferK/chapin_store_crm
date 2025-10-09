import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { GeneralRoutes } from '../enum/routes.enum';
import { UserManagerService } from '../services/execute/user-manager.service';
import { SessionManagerService } from '../services/execute/session-manager.service';

@Injectable()
export class LoggedGuard implements CanActivate {

  private readonly _userManagerService: UserManagerService = inject(UserManagerService);
  private readonly _router: Router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this._userManagerService.isUserAuthenticated()) return true;

    this._router.navigate([GeneralRoutes.LOGIN]).then((): void => {});
    return false;
  }

}
