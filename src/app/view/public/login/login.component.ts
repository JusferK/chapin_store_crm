import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../../services/transactional/login.service';
import { LoginResponse } from '../../../interface/api.interface';
import { SpinnerService } from '../../../services/execute/spinner.service';
import { catchError, finalize, Observable, Subscription, throwError, timer } from 'rxjs';
import { SessionManagerService } from '../../../services/execute/session-manager.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _loginApiService: LoginService = inject(LoginService);
  private _spinnerService: SpinnerService = inject(SpinnerService);
  private _sessionManagerService: SessionManagerService = inject(SessionManagerService);

  errorModalConfiguration: WritableSignal<{ showErrorModal: boolean, message: string }> = signal({
    showErrorModal: false,
    message: '',
  });

  simpleShow: boolean = false;

  loginForm: FormGroup = this._formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  private subscriptions: WritableSignal<Subscription[]> = signal<Subscription[]>([]);

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

    this.addSubscriptions(subscription);
  }

  hasError(control: string, errorType: string): boolean {
    return (this.loginForm.get(control)?.hasError(errorType) && this.loginForm.get(control)?.touched) ?? true;
  }

  markAsTouched(control: string): void {
    this.loginForm.get(control)?.markAsTouched();
  }

  closeModal(): void {
    this.updateErrorModalConfiguration('showErrorModal', false);
    this.resetForm();
  }

  private handleResponse(response: LoginResponse): void {
    this._sessionManagerService.postLogin(response);
  }

  private handleError(error: any): void {

    this.updateErrorModalConfiguration('message', error?.error?.message ?? 'Algo salio mal');
    this.updateErrorModalConfiguration('showErrorModal', true);
    this.simpleShow = true;

    const subscription: Subscription = timer(4000)
      .pipe(
        finalize((): void => this.onTimeIsUp()),
      )
      .subscribe();

    this.addSubscriptions(subscription);
  }

  private updateErrorModalConfiguration(key: string, value: any): void {
    this.errorModalConfiguration.update(prev => {
      return {
        ...prev,
        [key]: value,
      }
    });
  }

  private addSubscriptions(value: Subscription): void {
    this.subscriptions.update((prev: Subscription[]): Subscription[] => [...prev, value]);
  }

  private resetForm(): void {
    this.loginForm.reset();
  }

  private onTimeIsUp(): void {
    this.updateErrorModalConfiguration('showErrorModal', false);
    this.simpleShow = false;
    this.resetForm();
  }

}
