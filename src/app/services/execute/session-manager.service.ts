import { inject, Injectable } from '@angular/core';
import { UserManagerService } from './user-manager.service';
import { Router } from '@angular/router';
import { GeneralRoutes } from '../../enum/routes.enum';
import { SpinnerService } from './spinner.service';
import { LoginResponse } from '../../interface/api.interface';
import { SessionService } from '../transactional/session.service';
import { finalize, Observable } from 'rxjs';
import { LogoutResponse } from '../../interface/model.interface';
import { SessionInitializerService } from '../transactional/session-initializer.service';
import { ModalService } from './modal.service';
import { MODAL_ERROR_DEFAULT } from '../../settings/modals/modal-default-settings';
import { ErrorModalComponent } from '../../components/error-modal/error-modal.component';
import { ModalHandle } from '../../interface/modal.interface';

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

  logout(): Observable<LogoutResponse> {
    this._spinnerService.show();

    return this._sessionApiService.logout()
      .pipe(
        finalize((): void => {

          this._userManagerService.logout()

          this._router.navigate([GeneralRoutes.LOGIN])
            .finally((): void => this._spinnerService.hide());
        }),
      )

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
