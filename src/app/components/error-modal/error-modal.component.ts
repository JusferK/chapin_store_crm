import { Component, inject, signal, WritableSignal } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-error-modal',
  standalone: false,
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss'
})
export class ErrorModalComponent {

  private config: DynamicDialogConfig = inject(DynamicDialogConfig);

  message: WritableSignal<string> = signal(this.config.data?.message ?? 'Mensaje...');
  title: WritableSignal<string> = signal(this.config.data?.title ?? '¡Hubo un problema!');
  icon: WritableSignal<string> = signal(`pi ${this.config.data?.icon ?? 'pi-exclamation-triangle'}` );

}
