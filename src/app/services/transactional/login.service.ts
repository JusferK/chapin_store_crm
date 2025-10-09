import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login, LoginResponse } from '../../interface/api.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _httpClient: HttpClient = inject(HttpClient);

  login(request: Login): Observable<LoginResponse> {
    return this._httpClient.post<LoginResponse>('/v1/auth/login', request);
  }

}
