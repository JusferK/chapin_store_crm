import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICustomer } from '../../../../interface/model.interface';
import { Pagination } from '../../../../interface/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService {

  private readonly _httpClient: HttpClient = inject(HttpClient);

  getAll(page: number = 0): Observable<Pagination<ICustomer[]>> {

    const params: HttpParams = new HttpParams()
      .set('page', page);

    return this._httpClient.get<Pagination<ICustomer[]>>('/v1/customer/get-all', { params });
  }

  get(email: string): Observable<ICustomer> {

    const params: HttpParams = new HttpParams()
      .set('email', email);

    return this._httpClient.get<ICustomer>('/v1/customer/get', { params });
  }

  delete(email: string): Observable<{ removed: boolean }> {
    return this._httpClient.delete<{ removed: boolean }>(`/v1/customer/disable/${email}`);
  }

}
