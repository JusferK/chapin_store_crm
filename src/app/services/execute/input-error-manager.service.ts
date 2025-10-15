import { Injectable, signal, WritableSignal } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class InputErrorManagerService {

  private readonly _errors: WritableSignal<string[]> = signal(['min', 'maxlength', 'required', 'minlength']);

  handler(formControl: FormControl, input: string): string | undefined {

    const error: string | undefined = this._errors().find((value: string): boolean => formControl.hasError(value));

    return this.getErrorMessage(formControl, input, error);
  }

  private getErrorMessage(formControl: FormControl, input: string, error?: string): string | undefined {

    if (!error) return undefined;

    switch (error) {
      case 'maxlength':

        const requiredMaxLength = formControl.errors?.['maxlength'].requiredLength;
        const currentLength = formControl.errors?.['maxlength'].actualLength;

        return `El tamaño maximo del campo ${input} es ${requiredMaxLength} y actualmente es de ${currentLength}`;
      case 'min':

        const requiredMinLength = formControl.errors?.['minlength'].requiredLength;
        const actualLength = formControl.errors?.['minlength'].actualLength;

        return `El tamaño minimo del campo ${input} es ${requiredMinLength} y actualmente es de ${actualLength}`;
      case 'minlength':

        const minLength = formControl.errors?.['minlength'].requiredLength;
        const requiredLength = formControl.errors?.['minlength'].actualLength;

        return `El tamaño minimo del campo ${input} es ${requiredLength} y actualmente es de ${minLength}`;
      case 'required':
        return `El campo ${input} es requerido`;
      default:
        return undefined;
    }

  }



}
