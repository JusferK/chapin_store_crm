import { DynamicDialogConfig } from 'primeng/dynamicdialog';

const style = {
  width: '500px',
  height: '250px'
}

export const MODAL_ERROR_DEFAULT: DynamicDialogConfig = {
  modal: true,
  draggable: false,
  resizable: false,
  style,
  showHeader: true,
  closable: true,
};

export const MODAL_WARNING_DEFAULT: DynamicDialogConfig = {
  modal: true,
  style,
  showHeader: true,
  closable: true,
}

export const MODAL_SUMMARY_DEFAULT: DynamicDialogConfig = {
  modal: true,
  style: {
    width: '700px',
    height: 'auto',
  },
}
