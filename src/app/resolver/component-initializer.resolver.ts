import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  MaybeAsync,
  RedirectCommand,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { DataInjectionManagerService } from '../services/execute/data-injection-manager.service';
import { ProductModuleNavigation } from '../modules/product/enum/product-module-navigation.interface';

@Injectable()
export class ComponentInitializerResolver<T> implements Resolve<T> {

  private _dataInjectionManagerService: DataInjectionManagerService = inject(DataInjectionManagerService);
  private _router: Router = inject(Router);

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<T> {

    const key: string = route.data['key'];
    const redirectTo: string = route.data['redirectTo'];

    const data: T | undefined = this._dataInjectionManagerService.get(key);

    if (!data) this._router.navigate([redirectTo]).finally((): void => {});

    return of(data as T);
  }

}
