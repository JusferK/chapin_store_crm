import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolApiService {

  private readonly _httpClient: HttpClient = inject(HttpClient);

  getAll(): Observable<string[]> {
    return this._httpClient.get<string[]>('/v1/role/get-all-names');
  }

}
