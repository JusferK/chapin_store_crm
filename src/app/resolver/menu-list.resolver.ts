import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { MenuListResponse } from '../interface/api.interface';
import { map, Observable } from 'rxjs';
import { MenuListService } from '../services/transactional/menu-list.service';
import { UserManagerService } from '../services/execute/user-manager.service';
import { MapperService } from '../services/execute/mapper.service';
import { MenuItem } from 'primeng/api';

@Injectable()
export class MenuListResolver implements Resolve<MenuItem[]> {

  private _menuListApiService: MenuListService = inject(MenuListService);
  private _userManagerService: UserManagerService = inject(UserManagerService);
  private _mapperService: MapperService = inject(MapperService);

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<MenuItem[]> {
    const username: string = this._userManagerService.getAdminData!.username;

    return this._menuListApiService.getMenuList(username)
      .pipe(
        map((response: MenuListResponse[]): MenuItem[] => this._mapperService.formatItems(response))
      );
  }

}
