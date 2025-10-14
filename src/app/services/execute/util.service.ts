import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  evaluateNewData<T extends Record<string, any>>(form: T, oldObject: T): T {
    return Object.fromEntries(
      Object.entries(form).filter(([key, value]: [string, any]): boolean => value !== oldObject[key])
    ) as T;
  }

}
