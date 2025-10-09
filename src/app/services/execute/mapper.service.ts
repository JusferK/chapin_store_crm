import { Injectable } from '@angular/core';
import { MenuListResponse } from '../../interface/api.interface';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MapperService {

  formatItems(response: MenuListResponse[]): MenuItem[] {
    return response.map((item: MenuListResponse): MenuItem => this.mapItem(item));
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

}
