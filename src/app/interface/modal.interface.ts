import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';

export interface ModalArguments {
  modalSettings:                 DynamicDialogConfig;
  handler?:                      (data?: any) => void;
  component:                     any;
  timerMs?:                      number;
}

export interface ModalHandle<T = any> {
  closed$:                      Observable<T>;
  activateTimer:                () => Subscription;
}

export interface ISummary {
  key:                  string;
  old?:                 string;
  new:                  string;
}
