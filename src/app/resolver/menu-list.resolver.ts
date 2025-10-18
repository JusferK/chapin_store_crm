import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { MenuListResponse } from '../interface/api.interface';
import { map, Observable } from 'rxjs';
import { MenuListService } from '../services/transactional/menu-list.service';
import { UserManagerService } from '../services/execute/user-manager.service';
import { MapperService } from '../services/execute/mapper.service';
import { MenuItem } from 'primeng/api';
import { SessionManagerService } from '../services/execute/session-manager.service';

@Injectable()
export class MenuListResolver implements Resolve<MenuItem[]> {

  private readonly _menuListApiService: MenuListService = inject(MenuListService);
  private readonly _userManagerService: UserManagerService = inject(UserManagerService);
  private readonly _mapperService: MapperService = inject(MapperService);
  private readonly _sessionManagerService: SessionManagerService = inject(SessionManagerService);

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<MenuItem[]> {

    const username: string = this._userManagerService.getAdminData!.username;

    return this._menuListApiService.getMenuList(username)
      .pipe(
        map((response: MenuListResponse[]): MenuItem[] => {

          this._sessionManagerService.setMenuList = response;

          this._sessionManagerService.saveMenu(response);

          return this._mapperService.formatItems(response);
        })
      );
  }

}
