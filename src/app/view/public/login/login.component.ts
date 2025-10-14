import { Component, inject, OnDestroy, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../../services/transactional/session.service';
import { LoginResponse } from '../../../interface/api.interface';
import { SpinnerService } from '../../../services/execute/spinner.service';
import { catchError, finalize, Observable, Subscription, throwError } from 'rxjs';
import { SessionManagerService } from '../../../services/execute/session-manager.service';
import { MODAL_ERROR_DEFAULT } from '../../../settings/modals/modal-default-settings';
import { ModalHandlerService } from '../../../services/execute/modal-handler.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {

  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _loginApiService: SessionService = inject(SessionService);
  private _spinnerService: SpinnerService = inject(SpinnerService);
  private _sessionManagerService: SessionManagerService = inject(SessionManagerService);
  private _httpResponseHandler: ModalHandlerService = inject(ModalHandlerService);

  loginForm: FormGroup = this._formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  private subscriptions: WritableSignal<Subscription[]> = signal<Subscription[]>([]);

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this._spinnerService.show();

    const subscription: Subscription = this._loginApiService.login(this.loginForm.value)
      .pipe(
        catchError((error: any): Observable<LoginResponse> => {
          this.handleError(error);
          return throwError((): any => error);
        }),
        finalize((): void => this._spinnerService.hide()),
      )
      .subscribe({
        next: (response: LoginResponse): void => this.handleResponse(response),
      });

    this.addSubscriptions([subscription]);
  }

  hasError(control: string, errorType: string): boolean {
    return (this.loginForm.get(control)?.hasError(errorType) && this.loginForm.get(control)?.touched) ?? true;
  }

  markAsTouched(control: string): void {
    this.loginForm.get(control)?.markAsTouched();
  }

  private handleResponse(response: LoginResponse): void {
    this._sessionManagerService.postLogin(response);
  }

  private handleError(error: any): void {

    MODAL_ERROR_DEFAULT.data = {
      message: error?.error?.message ?? 'Algo salio mal',
      title: 'Credenciales Invalidas',
    };

    const { closed$, activateTimer } = this._httpResponseHandler.handleError({ modalSettings: MODAL_ERROR_DEFAULT, handler: (): void => this.resetForm() });

    const subscription: Subscription = activateTimer(), subscription2: Subscription = closed$.subscribe();

    this.addSubscriptions([subscription, subscription2]);
  }

  private addSubscriptions(value: Subscription[]): void {
    this.subscriptions.update((prev: Subscription[]): Subscription[] => [...prev, ...value]);
  }

  private resetForm(): void {
    this.loginForm.reset();
  }

  private unsubscribeAll(): void {
    this.subscriptions().forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

}
