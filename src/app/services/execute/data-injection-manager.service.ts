import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataInjectionManagerService {

  private _dataInjectionStorage: WritableSignal<Map<String, any>> = signal<Map<String, any>>(new Map<String, any>());

  get<T>(key: string): T {
    return this._dataInjectionStorage().get(key);
  }

  save(key: string, data: any): void {
    this._dataInjectionStorage.update((prev: Map<String, any>): Map<String, any> => {
      prev.set(key, data);
      return prev;
    });
  }

  update(key: string, data: any): void {
    this._dataInjectionStorage.update((prev: Map<String, any>): Map<String, any> => {
      prev.delete(key);
      prev.set(key, data);
      return prev;
    });
  }

  delete(key: string): void {
    this._dataInjectionStorage.update((prev: Map<String, any>): Map<String, any> => {
      prev.delete(key);
      return prev;
    });
  }

}
