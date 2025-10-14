import { Injectable } from '@angular/core';
import { MenuListResponse } from '../../interface/api.interface';
import { MenuItem } from 'primeng/api';
import { ISelect } from '../../interface/prime-ng.interface';

@Injectable({
  providedIn: 'root'
})
export class MapperService {

  formatItems(response: MenuListResponse[]): MenuItem[] {
    return response.map((item: MenuListResponse): MenuItem => this.mapItem(item));
  }

  formatSelectItems<T>({ keyName, keyCode, optionalKeyName = '' }: { keyName: string, keyCode: string, optionalKeyName?: string }, collection: T[]): ISelect[] {
    return collection.map((item: T): ISelect => this.mapSelectItem(keyName, keyCode, item, optionalKeyName));
  }

  private mapItem({ routerLink, icon, label, items }: MenuListResponse): MenuItem {

    if (items.length === 0) return {
      icon,
      label,
      routerLink,
    };

    const formattedItems: MenuItem[] = this.formatItems(items);

    return {
      items: formattedItems,
      icon,
      label,
      routerLink,
    };
  }

  private mapSelectItem<T>(keyName: string, keyCode: string, item: T, optionalName: string = ''): ISelect {
    return {
      code: item[keyCode as keyof T] as string,
      name: optionalName ? `${item[keyName as keyof T] as string} - ${item[optionalName as keyof T] as string}` : item[keyName as keyof T] as string
    };
  }

}
