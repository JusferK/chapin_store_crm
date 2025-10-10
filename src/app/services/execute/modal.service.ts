import { inject, Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalArguments, ModalHandle } from '../../interface/modal.interface';
import { map, Observable, Subscription, takeUntil, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private readonly _dialogService: DialogService = inject(DialogService);

  open<T = any>({ component, handler = (): void => {}, modalSettings, timerMs = 0, }: ModalArguments): ModalHandle<T> {

    const reference: DynamicDialogRef = this._dialogService.open(component, modalSettings)!;

    const activateTimer: () => Subscription = (): Subscription => {
      return timer(timerMs)
        .pipe(
          takeUntil(reference.onClose)
        )
        .subscribe((): void => reference.close());
    };

    const closed$ = reference.onClose
      .pipe(
        map(handler),
    ) as Observable<T>;

    return { closed$, activateTimer };
  }

}
