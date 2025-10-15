import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISummary } from '../../interface/modal.interface';

@Component({
  selector: 'app-summary-modal',
  standalone: false,
  templateUrl: './summary-modal.component.html',
  styleUrl: './summary-modal.component.scss'
})
export class SummaryModalComponent {

  private modalRef: DynamicDialogRef<SummaryModalComponent> = inject(DynamicDialogRef);
  private config: DynamicDialogConfig = inject(DynamicDialogConfig);

  data: WritableSignal<ISummary[]> = signal<ISummary[]>(this.config.data?.summary ?? []);
  title: WritableSignal<string> = signal<string>(this.config.data?.title ?? 'Estos son los cambios realizados');

  accept(): void {
    this.modalRef.close(true);
  }

  close(): void {
    this.modalRef.close(false);
  }

  isImage(key: string): boolean {
    return [
      'image',
      'picture',
      'photo'
    ].includes(key);
  }

  isCurrency(key: string): boolean {
    return [
      'price',
      'money',
      'currency',
      'total',
      'subtotal',
    ].includes(key);
  }

  imageHasError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = '/icon/image_placeholder.svg';
  }

}
