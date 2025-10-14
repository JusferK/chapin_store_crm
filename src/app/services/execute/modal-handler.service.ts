import { inject, Injectable } from '@angular/core';
import { ModalService } from './modal.service';
import {
  MODAL_ERROR_DEFAULT,
  MODAL_SUMMARY_DEFAULT,
  MODAL_WARNING_DEFAULT
} from '../../settings/modals/modal-default-settings';
import { ErrorModalComponent } from '../../components/error-modal/error-modal.component';
import { ModalHandle, ISummary } from '../../interface/modal.interface';
import {
  HandleErrorArguments,
  HandleSummaryArguments,
  HandleUpdateArguments
} from '../../interface/http-handle-response.interface';
import { WarningModalComponent } from '../../components/warning-modal/warning-modal.component';
import { SummaryModalComponent } from '../../components/summary-modal/summary-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalHandlerService {

  private _modalService: ModalService = inject(ModalService);

  handleError({ handler = (): void => {}, modalSettings = MODAL_ERROR_DEFAULT, component = ErrorModalComponent }: HandleErrorArguments): ModalHandle {

    return this._modalService
      .open({
        component,
        handler,
        modalSettings,
        timerMs: 4000,
      });

  }

  handleWarning({ handler = (): void => {}, modalSettings = MODAL_WARNING_DEFAULT, component = WarningModalComponent }: HandleUpdateArguments): ModalHandle {

    return this._modalService.open({
      component,
      handler,
      modalSettings,
    });

  }

  handleSummary<T>({
    handler = (): void => {},
    component = SummaryModalComponent,
    newData,
    oldData = undefined,
    modalSettings = MODAL_SUMMARY_DEFAULT,
  }: HandleSummaryArguments<T>): ModalHandle {

     const formattedModalSettings = {
       ...modalSettings,
       data: {
         ...modalSettings?.data,
         summary: this.mapData(newData, oldData)
       },
    };

    return this._modalService.open({
      component,
      handler,
      modalSettings: formattedModalSettings,
    });

  }

  private mapData<T extends Record<keyof T, any>>(newData: T, oldData?: T): ISummary[] {
    return Object.keys(newData)
      .map((key: string): ISummary => ({ key, old: oldData?.[key as keyof T], new: newData[key as keyof T], }));
  }

}
