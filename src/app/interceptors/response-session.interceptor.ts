import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, concatWith, EMPTY, map, mergeMap, Observable, switchMap, tap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { SessionManagerService } from '../services/execute/session-manager.service';
import { SKIP_ERROR_INTERCEPTOR } from '../constants/http-context-token';

export class ResponseSessionInterceptor implements HttpInterceptor {

  private readonly _sessionExpiredMessage: string = 'Las credenciales han expirado, inicie sesion de nuevo por favor.';
  private readonly _sessionManagerService: SessionManagerService = inject(SessionManagerService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const context: boolean = req.context.get(SKIP_ERROR_INTERCEPTOR);

    if (context) {
      return next.handle(req)
        .pipe(
          tap(() => console.log('came here! '))
        );
    }

    return next.handle(req)
      .pipe(
        catchError((error: any) => {


          if (error?.error?.message === this._sessionExpiredMessage) {
            return this._sessionManagerService.revokeSession()
              .pipe(
                switchMap(({ obs$, obs2$ }) => {
                  return throwError(() => ({ obs$, obs2$ }))
                }),
              );
          }

          if (error?.error === null && error?.status === 500 && error?.type === undefined) {
            this._sessionManagerService.triggerNotAvailable();
            return throwError(() => error);
          }

          return throwError(() => EMPTY);
        }),
      )
  }

}
