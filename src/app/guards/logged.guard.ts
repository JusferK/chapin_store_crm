import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { GeneralRoutes } from '../enum/routes.enum';

@Injectable()
export class LoggedGuard implements CanActivate {

  private readonly _router: Router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this._router.navigate([GeneralRoutes.LOGIN]).then((): void => {});
    return false;
  }

}
