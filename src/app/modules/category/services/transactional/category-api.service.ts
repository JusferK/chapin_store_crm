import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from '../../../../interface/model.interface';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryApiService {

  private _httpClient: HttpClient = inject(HttpClient);

  getAllCategories(): Observable<ICategory[]> {
    return this._httpClient.get<ICategory[]>('/v1/category/get-all');
  }

  save(body: ICategory): Observable<ICategory> {
    return this._httpClient.post<ICategory>('/v1/category/new', body);
  }

  edit(body: ICategory): Observable<ICategory> {
    return this._httpClient.patch<ICategory>('/v1/category/patch', body);
  }

  delete(id: number): Observable<{ deleted: boolean }> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this._httpClient.delete<{ deleted: boolean }>('/v1/category/delete', { params });
  }

}
