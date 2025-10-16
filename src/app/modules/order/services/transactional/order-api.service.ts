import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '../../../../interface/pagination.interface';
import { IOrder } from '../../../../interface/model.interface';
import { Status } from '../../../../enum/model.enum';

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {

  private readonly _httpClient: HttpClient = inject(HttpClient);

  getAll(page: number = 0): Observable<Pagination<IOrder[]>> {

    const params: HttpParams = new HttpParams()
      .set('page', page);

    return this._httpClient.get<Pagination<IOrder[]>>('/v1/order-request/get-all', { params });
  }

  find(argument: string): Observable<IOrder[]> {
    return this._httpClient.post<IOrder[]>('/v1/order-request/get', { argument })
  }

  updateStatus(status: Status, orderRequestId: number): Observable<{ status: Status }> {
    return this._httpClient.patch<{ status: Status }>('/v1/order-request/update/status', { orderRequestId, status });
  }

}
