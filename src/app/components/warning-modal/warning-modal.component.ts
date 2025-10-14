import { Component, inject, signal, WritableSignal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-warning-modal',
  standalone: false,
  templateUrl: './warning-modal.component.html',
  styleUrl: './warning-modal.component.scss'
})
export class WarningModalComponent {

  private config: DynamicDialogConfig = inject(DynamicDialogConfig);
  private modalRef: DynamicDialogRef<WarningModalComponent> = inject(DynamicDialogRef);

  icon: WritableSignal<string> = signal(`pi ${this.config.data.icon ?? 'pi-exclamation-circle'}` );
  message: WritableSignal<string> = signal(this.config.data.message);
  title: WritableSignal<string> = signal(this.config.data.title ?? '¿Estas seguro de continuar?');
  showCancelButton: WritableSignal<boolean> = signal(this.config.data?.showCancelButton ?? true);
  acceptButtonConfiguration: WritableSignal<any> = signal(this.config.data?.acceptButtonConfiguration ?? {
    severity: 'danger',
    variant: 'text',
    label: 'Aceptar',
  });

  accept(): void {
    this.modalRef.close(true);
  }

  close(): void {
    this.modalRef.close(false);
  }

}
