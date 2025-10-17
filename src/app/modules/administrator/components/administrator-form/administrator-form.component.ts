import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputErrorManagerService } from '../../../../services/execute/input-error-manager.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IAdministrator } from '../../../../interface/model.interface';
import { IPButton } from '../../../primeng/interface/primeng-components.interface/primeng-components.interface';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-administrator-form',
  standalone: false,
  templateUrl: './administrator-form.component.html',
  styleUrl: './administrator-form.component.scss'
})
export class AdministratorFormComponent {

  private readonly _inputErrorManagerService: InputErrorManagerService = inject(InputErrorManagerService);
  private readonly _modalReference: DynamicDialogRef<AdministratorFormComponent> = inject(DynamicDialogRef);
  private readonly _configuration: DynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);

  private administrator: WritableSignal<IAdministrator | null> = signal<IAdministrator | null>(this._configuration.data.administrator ?? null);

  options: WritableSignal<SelectItem[]> = signal<SelectItem[]>(this.getOptions(this._configuration.data.roles))

  title: Signal<string> = computed((): string => {
    return this.mode() === 'UPDATE' ? `Actualizar contraseña de ${this.administrator()?.username}` : 'Crear administrador.'
  });

  administratorForm: FormGroup = this._formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(45)]],
  });

  mode: WritableSignal<'UPDATE' | 'CREATE'> = signal(this._configuration.data.mode);

  buttonConfigurations: WritableSignal<IPButton[]> = signal<IPButton[]>(this._configuration.data.buttonConfigurations);

  get getFirstButtonConfig(): IPButton {
    return this.buttonConfigurations()[0];
  }

  get getSecondButtonConfig(): IPButton {
    return this.buttonConfigurations()[1];
  }

  constructor() {
    this.initializeComponent();
  }

  accept(): void {

    if (this.administratorForm.invalid) {
      this.administratorForm.markAllAsTouched();
      return;
    }

    this._modalReference.close({ result: true, content: this.administratorForm.value });

  }

  getErrorMessage(controlProperty: string, visualizeControl: string): string | undefined {
    const control = this.administratorForm.get(controlProperty) as FormControl;
    return this._inputErrorManagerService.handler(control, visualizeControl);
  }

  hasError(control: string): boolean {
    return this._inputErrorManagerService.hasError(this.administratorForm, control);
  }

  cancel(): void {
    this._modalReference.close();
  }

  private initializeComponent(): void {
    this.initializeForm();
  }

  private initializeForm(): void {

    if (this.mode() === 'UPDATE') return;

    this.administratorForm = this._formBuilder.group({
      ...this.administratorForm.controls,
      username: ['', [Validators.required, Validators.maxLength(50)]],
      role: ['', [Validators.required]],
    });

  }

  private getOptions(values: string[]): SelectItem[] {
    return values.map((value: string): SelectItem => ({ value, label: value }));
  }

}
