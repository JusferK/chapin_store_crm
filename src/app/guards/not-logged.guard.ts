import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { inject, Injectable } from '@angular/core';

@Injectable()
export class NotLoggedGuard implements CanActivate {

  private readonly _router: Router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return true;
  }

}
