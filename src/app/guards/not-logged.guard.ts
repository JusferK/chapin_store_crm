import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { UserManagerService } from '../services/execute/user-manager.service';

@Injectable()
export class NotLoggedGuard implements CanActivate {

  private readonly _userManagerService: UserManagerService = inject(UserManagerService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return !this._userManagerService.isUserAuthenticated();
  }

}
