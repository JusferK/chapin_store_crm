import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ICategory, IProduct } from '../../../../interface/model.interface';
import { ActivatedRoute } from '@angular/router';
import { MODAL_SUMMARY_DEFAULT, MODAL_WARNING_DEFAULT } from '../../../../settings/modals/modal-default-settings';
import { catchError, debounceTime, delay, finalize, Subject, Subscription, throwError } from 'rxjs';
import { ModalHandlerService } from '../../../../services/execute/modal-handler.service';
import { SpinnerService } from '../../../../services/execute/spinner.service';
import { CategoryApiService } from '../../services/transactional/category-api.service';
import { MessageService } from 'primeng/api';
import { ModalService } from '../../../../services/execute/modal.service';
import { CategoryFormModalComponent } from '../../components/category-form-modal/category-form-modal.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IPButton } from '../../../primeng/interface/primeng-components.interface/primeng-components.interface';

@Component({
  selector: 'app-list-category',
  standalone: false,
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.scss'
})
export class ListCategoryComponent implements OnInit, OnDestroy {

  categories: WritableSignal<ICategory[]> = signal<ICategory[]>([]);

  private subscriptions: WritableSignal<Subscription[]> = signal<Subscription[]>([]);

  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _modalHandlerService: ModalHandlerService = inject(ModalHandlerService);
  private readonly _click$: Subject<void> = new Subject<void>();
  private readonly _spinnerService: SpinnerService = inject(SpinnerService);
  private readonly _categoryApiService: CategoryApiService = inject(CategoryApiService);
  private readonly _primengMessageService: MessageService = inject(MessageService);
  private readonly _modalService: ModalService = inject(ModalService);

  private readonly modalFormSettings: DynamicDialogConfig = {
    modal: true,
    draggable: false,
    style: {
      width: '600px',
      height: '500px',
    }
  }

  private readonly buttonsConfigurations: IPButton[] = [
    {
      label: 'Regresar',
      severity: 'danger',
      raised: true,
      icon: 'pi pi-arrow-left',
    },
    {
      label: 'Aceptar',
      severity: 'info',
      raised: true,
      icon: 'pi pi-send',
    },
  ];

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  add(): void {

    const modalSettings = {
      ...this.modalFormSettings,
      data: {
        category: null,
        buttonConfigurations: this.buttonsConfigurations,
        mode: 'CREATE',
      },
    };

    const { closed$ } = this._modalService.open({
      component: CategoryFormModalComponent,
      handler: (response: { result: boolean, body: ICategory }): void => this.showSummary(response?.body, response.result),
      modalSettings,
    });

    this.addSubscription(closed$.subscribe());

  }

  update(category: ICategory): void {

    MODAL_WARNING_DEFAULT.data = {
      message: '',
      title: '¿Quieres actualizar esta categoria?',
    }

    const { closed$ } = this._modalHandlerService
      .handleWarning({ handler: (result: boolean): void => this.handleUpdate(result, category) });

    this.addSubscription(closed$.subscribe());
  }

  delete(category: ICategory): void {

    MODAL_WARNING_DEFAULT.data = {
      title: 'Estas apunto de remover esta categoria',
      message: '¿Deseas continuar?'
    };

    const { closed$ } = this._modalHandlerService.handleWarning({
      modalSettings: MODAL_WARNING_DEFAULT,
      handler: (result: boolean): void => {
        if (!result) return;
        this.handleRemove(category);
      }
    });

    this.addSubscription(closed$.subscribe());

  }

  onRefresh(): void {
    this._click$.next();
  }

  private initializeComponent(): void {
    this.getCategories();
    this.refreshBehaviour();
  }

  private getCategories(): void {
    this.categories.set(this._activatedRoute.snapshot.data['categories']);
  }

  private handleUpdate(result: boolean, category: ICategory): void {

    if (!result) return;

    const modalSettings = {
      ...this.modalFormSettings,
      data: {
        category,
        buttonConfigurations: this.buttonsConfigurations,
        mode: 'UPDATE',
      },
    };

    const { closed$ } = this._modalService.open({
      component: CategoryFormModalComponent,
      handler: ({ body, result }: { result: boolean, body: ICategory }): void => this.showEditSummary(body, category, result),
      modalSettings,
    });

    this.addSubscription(closed$.subscribe());

  }

  private handleRemove({ categoryId }: ICategory): void {

    this._spinnerService.show();

    const subscription: Subscription = this._categoryApiService.delete(categoryId!)
      .pipe(
        catchError((error: any) => {
          this.handleError('La categoria no pudo ser eliminada', 'Ha ocurrido un error, por favor intenta mas tarde.');
          return throwError(() => error);
        }),
        finalize((): void => this._spinnerService.hide()),
      )
      .subscribe({
        next: ({ deleted }: { deleted: boolean }): void => this.removeFromView(categoryId!, deleted),
      })

    this.addSubscription(subscription);
  }

  private removeFromView(id: number, deleted: boolean): void {

    if (!deleted) {
      this.handleError('La categoria no pudo ser eliminada', 'Ha ocurrido un error, por favor intenta mas tarde.')
      return;
    }

    this.categories.update((prev: ICategory[]): ICategory[] => prev.filter((category: ICategory): boolean => category.categoryId !== id));
    this.handleSuccess('Categoria eliminada', `La categoria con el id ${id} ha sido eliminada exitosamente`);
  }

  private addSubscription(subscription: Subscription): void {
    this.subscriptions.update((prev: Subscription[]): Subscription[] => [...prev, subscription]);
  }

  private refreshBehaviour(): void {

    const subscription: Subscription = this._click$
      .pipe(
        debounceTime(300),
      )
      .subscribe({
        next: (): void => this.refresh(),
      });

    this.addSubscription(subscription);

  }

  private refresh(): void {

    this._spinnerService.show();

    const subscription: Subscription = this._categoryApiService.getAllCategories()
      .pipe(
        delay(1000),
        catchError((error: any) => {
          this.handleError('La transaccion no pude ser ejecutada', error?.error?.message ?? 'Ha ocurrido un error, por favor intenta mas tarde.');
          return throwError(() => error);
        }),
        finalize(() => this._spinnerService.hide()),
      )
      .subscribe({
        next: (response: ICategory[]): void => this.categories.set(response),
      });

    this.addSubscription(subscription);

  }

  private unsubscribeAll(): void {
    this.subscriptions().forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

  private handleSuccess(summary: string, detail: string, life: number = 4000): void {
    this._primengMessageService.add({ severity: 'success', summary, detail, life });
  }

  private showEditSummary(body: ICategory, categorySelected: ICategory, decision: boolean): void {

    const { categoryId } = categorySelected;

    if (!decision) return;

    const { closed$ } = this._modalHandlerService.handleSummary<ICategory>({
      newData: body,
      oldData: categorySelected,
      handler: (result: boolean): void => {
        if (!result) return;
        this.edit(body, categoryId!);
      },
    });

    this.addSubscription(closed$.subscribe());
  }

  private showSummary(body: ICategory, result: boolean): void {

    if (!result) return;

    MODAL_SUMMARY_DEFAULT.data = {
      title: 'Nueva categoria'
    }

    const { closed$ } = this._modalHandlerService.handleSummary<ICategory>({
      newData: body,
      handler: (result: boolean): void => {
        if (!result) return;
        this.create(body);
      },
      modalSettings: MODAL_SUMMARY_DEFAULT,
    });

    this.addSubscription(closed$.subscribe());

  }

  private edit(category: ICategory, categoryId: number): void {

    this._spinnerService.show();

    const subscription: Subscription = this._categoryApiService.edit({ ...category, categoryId })
      .pipe(
        catchError((error: any) => {
          this.handleError('La categoria no pudo ser editada', error?.error?.message ?? 'Ha ocurrido un error, por favor intenta mas tarde.');
          return throwError(() => error);
        }),
        finalize((): void => this._spinnerService.hide()),
      )
      .subscribe({
        next: (response: ICategory): void => this.updateView(response),
      });

    this.addSubscription(subscription);

  }

  private create(body: ICategory): void {

    this._spinnerService.show();

    const subscription: Subscription = this._categoryApiService.save(body)
      .pipe(
        catchError((error: any) => {
          this.handleError('La categoria no pudo ser editada', error?.error?.message ?? 'Ha ocurrido un error, por favor intenta mas tarde.');
          return throwError(() => error);
        }),
        finalize(() => this._spinnerService.hide()),
      ).subscribe({
        next: (response: ICategory): void => this.handleSuccessAddition(response),
      })


    this.addSubscription(subscription);

  }

  private updateView(response: ICategory): void {

    this.categories.update((prev: ICategory[]): ICategory[] => {
      const find: ICategory = prev.find((category: ICategory): boolean => category.categoryId === response.categoryId)!;
      return prev.map((category: ICategory): ICategory => {
        if (category.categoryId === find.categoryId) return { ...find, ...response };
        return category;
      });
    });

    this.handleSuccess('La categoria ha sido editada exitosamente!', `La categoria con el id ${response.categoryId} fue editada.`)

  }

  private handleSuccessAddition(response: ICategory): void {
    this.categories.update((prev: ICategory[]): ICategory[] => [...prev, response]);

    this.handleSuccess('Nueva categoria agregada!', `La nueva categoria tiene el id ${response.categoryId}.`)
  }

  private handleError(summary: string, detail: string, life: number = 6000): void {
    this._primengMessageService.add({ severity: 'error', summary, detail, life });
  }

}
