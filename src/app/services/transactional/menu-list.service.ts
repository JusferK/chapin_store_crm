import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuListResponse } from '../../interface/api.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuListService {

  private _http: HttpClient = inject(HttpClient);


  getMenuList(username: string): Observable<MenuListResponse[]> {

    const usernameParam: HttpParams = new HttpParams()
      .append('username', username);

    return this._http.get<MenuListResponse[]>('/v1/menu/get-by-role', { params: usernameParam });
  }

}
