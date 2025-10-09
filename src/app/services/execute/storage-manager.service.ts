import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageManagerService {

  save(data: any, key: string): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  retrieve<T>(key: string): T {
    return JSON.parse(localStorage.getItem(key) ?? 'null') as T;
  }

  clear(): void {
    localStorage.clear();
  }

}
