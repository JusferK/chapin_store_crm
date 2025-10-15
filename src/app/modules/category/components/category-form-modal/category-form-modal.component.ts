import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ICategory, IProduct } from '../../../../interface/model.interface';
import { IPButton } from '../../../primeng/interface/primeng-components.interface/primeng-components.interface';
import { InputErrorManagerService } from '../../../../services/execute/input-error-manager.service';
import { UtilService } from '../../../../services/execute/util.service';
import { MODAL_WARNING_DEFAULT } from '../../../../settings/modals/modal-default-settings';
import { ModalHandlerService } from '../../../../services/execute/modal-handler.service';

@Component({
  selector: 'app-category-form-modal',
  standalone: false,
  templateUrl: './category-form-modal.component.html',
  styleUrl: './category-form-modal.component.scss'
})
export class CategoryFormModalComponent implements OnInit {

  private readonly config: DynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly modalRef: DynamicDialogRef<CategoryFormModalComponent> = inject(DynamicDialogRef);
  private readonly _inputErrorManagerService: InputErrorManagerService = inject(InputErrorManagerService);
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _utilService: UtilService = inject(UtilService);
  private readonly _modalHandler: ModalHandlerService = inject(ModalHandlerService);

  categoryForm = this._formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300)]],
  });

  category: WritableSignal<ICategory | null> = signal<ICategory | null>(null);
  title: WritableSignal<string> = signal<string>('');
  buttonConfigurations: WritableSignal<IPButton[]> = signal([]);
  mode: WritableSignal<'CREATE' | 'UPDATE'> = signal<'CREATE' | 'UPDATE'>('CREATE');

  get getFirstButtonConfig(): IPButton {
    return this.buttonConfigurations()[0];
  }

  get getSecondButtonConfig(): IPButton {
    return this.buttonConfigurations()[1];
  }

  ngOnInit(): void {
    this.initializeModal();
  }

  hasError(control: string): boolean {
    return this._inputErrorManagerService.hasError(this.categoryForm, control);
  }

  getErrorMessage(controlProperty: string, visualizeControl: string): string | undefined {
    const control = this.categoryForm.get(controlProperty) as FormControl;
    return this._inputErrorManagerService.handler(control, visualizeControl);
  }

  accept(): void {

    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    if (this.mode() === 'UPDATE') {
      this.handleEdit();
      return;
    }

    this.modalRef.close({ result: true, body: this.categoryForm.value });

  }

  cancel(): void {
    this.modalRef.close({ result: false });
  }

  handleEdit(): void {
    const body: ICategory = this._utilService.evaluateNewData<ICategory>(this.categoryForm.value as ICategory, this.category()!);

    if (Object.keys(body).length === 0) {
      this.noChangesHandler();
      return;
    }

    this.modalRef.close({ result: true, body });

  }

  private initializeModal(): void {

    const { buttonConfigurations, mode, category = null  } = this.config.data;
    this.buttonConfigurations.set(buttonConfigurations);

    if (mode !== this.mode()) {
      this.mode.set(mode);
      this.category.set(category as ICategory);
      this.title.set(`Te encuentras editando la categoria: ${this.category()!.name} - ${this.category()!.categoryId}`);
      this.categoryForm.reset(this.category()!);
      return;
    }

    this.title.set(`Crea una nueva categoria.`);

  }

  private noChangesHandler(): void {

    MODAL_WARNING_DEFAULT.data = {
      title: 'No se ha hecho algun cambio',
      message: '',
      showCancelButton: false,
      acceptButtonConfiguration: {
        severity: 'info',
        variant: '',
        label: 'Ok'
      },
    };

    this._modalHandler.handleWarning({ modalSettings: MODAL_WARNING_DEFAULT });
  }


}
