import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from '../../../../interface/model.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryApiService {

  private _httpClient: HttpClient = inject(HttpClient);

  getAllCategories(): Observable<ICategory[]> {
    return this._httpClient.get<ICategory[]>('/v1/category/get-all');
  }

}
