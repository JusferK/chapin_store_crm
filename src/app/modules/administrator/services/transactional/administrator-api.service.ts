import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAdministrator, RegisterAdministrator } from '../../../../interface/model.interface';

@Injectable({
  providedIn: 'root'
})
export class AdministratorApiService {

  private readonly _httpClient: HttpClient = inject(HttpClient);

  getAll(): Observable<IAdministrator[]> {
    return this._httpClient.get<IAdministrator[]>('/v1/administrator/get-all');
  }

  get(username: string): Observable<IAdministrator> {

    const params: HttpParams = new HttpParams()
      .set('username', username);

    return this._httpClient.get<IAdministrator>('/v1/administrator/get', { params });
  }

  register(administrator: RegisterAdministrator): Observable<IAdministrator> {
    return this._httpClient.post<IAdministrator>('/v1/administrator/register', administrator);
  }

  updatePassword(body: { username: string, password: string }): Observable<{ updated: boolean }> {
    return this._httpClient.patch<{ updated: boolean }>('/v1/administrator/patch/password', body);
  }

  disable(username: string): Observable<{ disable: boolean }> {

    const params: HttpParams = new HttpParams()
      .set('username', username);

    return this._httpClient.delete<{ disable: boolean }>('/v1/administrator/disable', { params });
  }

}
