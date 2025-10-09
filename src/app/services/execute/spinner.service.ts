import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private showSpinner: WritableSignal<boolean> = signal<boolean>(false);

  get getShowSpinner(): boolean {
    return this.showSpinner();
  }

  set setShowSpinner(value: boolean) {
    this.showSpinner.set(value);
  }

  show(): void {
    this.setShowSpinner = true;
  }

  hide(): void {
    this.setShowSpinner = false;
  }

}
