import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { Login, LoginResponse } from '../../interface/api.interface';
import { Observable } from 'rxjs';
import { LogoutResponse } from '../../interface/model.interface';
import { SKIP_ERROR_INTERCEPTOR } from '../../constants/http-context-token';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private _httpClient: HttpClient = inject(HttpClient);

  login(request: Login): Observable<LoginResponse> {
    return this._httpClient.post<LoginResponse>('/v1/auth/login', request);
  }

  logout(token: string, addContext: boolean): Observable<LogoutResponse> {

    let context: HttpContext | {} = { context: new HttpContext().set(SKIP_ERROR_INTERCEPTOR, addContext) };

    return this._httpClient.post<LogoutResponse>('/v1/auth/logout', { token }, context);
  }

}
