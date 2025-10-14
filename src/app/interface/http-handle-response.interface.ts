import { DynamicDialogConfig } from 'primeng/dynamicdialog';

export interface HandleErrorArguments {
  modalSettings?:                   DynamicDialogConfig,
  component?:                       any;
  handler?:                         (data?: any) => void,
  timeMs?:                          number;
}

export interface HandleUpdateArguments extends HandleErrorArguments {}

export interface HandleSummaryArguments<T> extends HandleErrorArguments {
  newData:                            T;
  oldData?:                            T;
}
