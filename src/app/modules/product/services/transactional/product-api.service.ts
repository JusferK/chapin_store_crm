import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '../../../../interface/pagination.interface';
import { IProduct } from '../../../../interface/model.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

  private readonly _httpClient: HttpClient = inject(HttpClient);

  getAllProducts(page: number = 0): Observable<Pagination<IProduct[]>> {

    const params: HttpParams = new HttpParams()
      .set('page', page);

    return this._httpClient.get<Pagination<IProduct[]>>('/v1/product/get-all', { params });
  }

  getProduct(argument: string): Observable<IProduct[]> {

    return this._httpClient.post<IProduct[]>('/v1/product/get', { argument });
  }

  editProduct(body: IProduct): Observable<IProduct> {
    return this._httpClient.patch<IProduct>('/v1/product/patch', body);
  }

  add(body: IProduct): Observable<IProduct> {
    return this._httpClient.post<IProduct>('/v1/product/new', body);
  }

  remove(id: number): Observable<{ deleted: boolean }> {

    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this._httpClient.delete<{ deleted: boolean }>('/v1/product/delete', { params });
  }

}
