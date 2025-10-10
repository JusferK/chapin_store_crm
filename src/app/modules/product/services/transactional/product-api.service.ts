import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '../../../../interface/pagination.interface';
import { IProduct } from '../../../../interface/model.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

  private readonly _httpClient: HttpClient = inject(HttpClient);

  getAllProducts(): Observable<Pagination<IProduct[]>> {
    return this._httpClient.get<Pagination<IProduct[]>>('/v1/product/get-all');
  }

}
