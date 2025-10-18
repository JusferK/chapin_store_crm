import {
  ActivatedRouteSnapshot,
  CanActivate, CanActivateChild, GuardResult, MaybeAsync, Router,
  RouterStateSnapshot
} from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { SessionManagerService } from '../services/execute/session-manager.service';
import { MenuListResponse } from '../interface/api.interface';
import { GeneralRoutes } from '../enum/routes.enum';

@Injectable()
export class NavigationGuard implements CanActivateChild {

  private readonly _sessionManagerService: SessionManagerService = inject(SessionManagerService);
  private readonly _router = inject(Router);

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const uri: string = state.url;
    let found: boolean = false;

    const findRoute = (menu: MenuListResponse[]) => {
      menu.forEach((menuItem: MenuListResponse) => {
        if (found) return;

        const getUri: string = menuItem.routerLink;
        if (getUri.includes(uri)) found = true;
        if (menuItem.items.length > 0) findRoute(menuItem.items);
      });

    };

    findRoute(this._sessionManagerService.getMenuList);

    if (!found) {
      this._router.navigate([GeneralRoutes.HOME]).then(() => {});
      return false;
    }

    return true;

  }


}
