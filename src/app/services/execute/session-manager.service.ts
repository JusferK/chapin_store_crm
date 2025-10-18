import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { UserManagerService } from './user-manager.service';
import { Router } from '@angular/router';
import { GeneralRoutes } from '../../enum/routes.enum';
import { SpinnerService } from './spinner.service';
import { LoginResponse, MenuListResponse } from '../../interface/api.interface';
import { SessionService } from '../transactional/session.service';
import { catchError, finalize, forkJoin, Observable, of, throwError } from 'rxjs';
import { LogoutResponse } from '../../interface/model.interface';
import { SessionInitializerService } from '../transactional/session-initializer.service';
import { ModalService } from './modal.service';
import { MODAL_ERROR_DEFAULT } from '../../settings/modals/modal-default-settings';
import { ErrorModalComponent } from '../../components/error-modal/error-modal.component';
import { ModalHandle } from '../../interface/modal.interface';
import { StorageManagerService } from './storage-manager.service';
import { StorageKeys } from '../../enum/storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class SessionManagerService {

  private readonly _userManagerService: UserManagerService = inject(UserManagerService);
  private readonly _spinnerService: SpinnerService = inject(SpinnerService);
  private readonly _router: Router = inject(Router);
  private readonly _sessionApiService: SessionService = inject(SessionService);
  private readonly _sessionInitializerService: SessionInitializerService = inject(SessionInitializerService);
  private readonly _modalService: ModalService = inject(ModalService);
  private readonly _storageManagerService: StorageManagerService = inject(StorageManagerService);

  private menuList: WritableSignal<MenuListResponse[]> = signal<MenuListResponse[]>(this.retrieveMenu() ?? []);
  private notAvailable: WritableSignal<boolean> = signal<boolean>(false);

  get getMenuList(): MenuListResponse[] {
    return this.menuList();
  }

  get getNotAvailable(): boolean {
    return this.notAvailable();
  }

  set setMenuList(menuList: MenuListResponse[]) {
    this.menuList.set(menuList);
  }

  set setNotAvailable(value: boolean) {
    this.notAvailable.set(value);
  }

  evaluateSession(): void  {
    this._spinnerService.show();
    this._userManagerService.evaluateAuthentication();
    this._spinnerService.hide();
    if (this._sessionInitializerService.getTokenWasExpired) this.expiredSessionWarning();
  }

  postLogin(response: LoginResponse): void {

    this._userManagerService.saveSession(response);

    if (!this._userManagerService.isUserAuthenticated()) return;

    this._spinnerService.show();
    this._router.navigate([GeneralRoutes.HOME])
      .finally((): void => this._spinnerService.hide());

  }

  logout(context: boolean = true): Observable<LogoutResponse> {

    this._spinnerService.show();

    return this._sessionApiService.logout(this._userManagerService.getToken(), context)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        }),
        finalize(() => this._spinnerService.hide()),
      )

  }

  revokeSession<T>(): Observable<{ obs$: LogoutResponse, obs2$: T }>  {
    return forkJoin({
      obs$: this.logout(false).pipe(finalize(() => {
        this._userManagerService.logout();
        this._router.navigate([GeneralRoutes.LOGIN]).then(() => {});
      })),
      obs2$: this.expiredSessionWarning().closed$,
    });
  }

  saveMenu(menuItems: MenuListResponse[]): void {
    this._storageManagerService.save(menuItems, StorageKeys.MENU_ITEMS_SESSION);
  }

  retrieveMenu(): MenuListResponse[] {
    return this._storageManagerService.retrieve(StorageKeys.MENU_ITEMS_SESSION);
  }

  triggerNotAvailable(): void {
    this.setNotAvailable = true;
    this._router.navigate([GeneralRoutes.NOT_AVAILABLE])
      .then(() => {});
  }

  private expiredSessionWarning(): ModalHandle {

    MODAL_ERROR_DEFAULT.data = {
      message: 'La sesion ha expirado, por favor logueate de nuevo.',
      title: '¡Tu sesion ha expirado!',
    }

    return this._modalService
      .open({
        component: ErrorModalComponent,
        modalSettings: MODAL_ERROR_DEFAULT,
        timerMs: 4000,
      });

  }

}
