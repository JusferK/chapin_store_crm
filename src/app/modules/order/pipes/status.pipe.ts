import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../../../enum/model.enum';

@Pipe({
  name: 'status',
  standalone: false
})
export class StatusPipe implements PipeTransform {

  transform(value: Status, ...args: unknown[]): string {
    switch (value) {
      case 'CANCELLED':
        return 'Cancelada';
      case 'DELIVERED':
        return 'Entregada';
      case 'PENDING':
        return 'Pendiente';
      case 'ON_ROUTE':
        return 'En ruta';
      default:
        return 'Valor desconocido.';
    }
  }

}
