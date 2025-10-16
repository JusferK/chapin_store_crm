import { Component, inject, linkedSignal, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from '../../../../interface/pagination.interface';
import { IOrder } from '../../../../interface/model.interface';
import { TableLazyLoadEvent } from 'primeng/table';
import { OrderApiService } from '../../services/transactional/order-api.service';
import { catchError, debounceTime, finalize, Observable, Subject, Subscription, throwError } from 'rxjs';
import { MODAL_ERROR_DEFAULT } from '../../../../settings/modals/modal-default-settings';
import { ModalHandlerService } from '../../../../services/execute/modal-handler.service';
import { FormBuilder } from '@angular/forms';
import { SpinnerService } from '../../../../services/execute/spinner.service';
import { StatusPipe } from '../../pipes/status.pipe';
import { MessageService, SelectItem } from 'primeng/api';
import { Status } from '../../../../enum/model.enum';

@Component({
  selector: 'app-list-orders',
  standalone: false,
  templateUrl: './list-orders.component.html',
  styleUrl: './list-orders.component.scss'
})
export class ListOrdersComponent implements OnInit, OnDestroy {

  expandedRows = {};

  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _orderApiService: OrderApiService = inject(OrderApiService);
  private readonly _modalHandlerService: ModalHandlerService = inject(ModalHandlerService);
  private readonly _spinnerService: SpinnerService = inject(SpinnerService);
  private readonly _click$: Subject<void> = new Subject<void>();
  private readonly _statusPipe: StatusPipe = inject(StatusPipe);
  private readonly _primengMessageService: MessageService = inject(MessageService);

  orderForm = this._formBuilder.group({
    search: [''],
  });

  updateOrderForm = this._formBuilder.group({
    status: [''],
    orderRequestId: [''],
  });

  paginationOrder!: WritableSignal<Pagination<IOrder[]>>;
  orderList: WritableSignal<IOrder[]> = signal([]);
  searchOrderList: WritableSignal<IOrder[]> = signal([]);
  firstTimeLoading: WritableSignal<boolean> = signal<boolean>(false)
  first: WritableSignal<number> = signal<number>(0);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);

  isEditing: WritableSignal<boolean> = signal(false);
  editingIndex: WritableSignal<number> = signal(-1);
  selectedOrder: WritableSignal<IOrder | undefined> = signal(undefined);

  subscription: WritableSignal<Subscription[]> = signal<Subscription[]>([]);

  options: WritableSignal<SelectItem[]> = signal<SelectItem[]>([]);

  orders: WritableSignal<IOrder[]> = linkedSignal((): IOrder[] => {
    return this.searchOrderList().length > 0 ? this.searchOrderList() : this.orderList();
  });

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  getSeverity(status: Status) {
    switch (status) {
      case 'PENDING':
        return 'warn';
      case 'ON_ROUTE':
        return 'contrast';
      case 'CANCELLED':
        return 'danger';
      case 'DELIVERED':
        return 'success';
        default:
          return undefined;
    }
  }

  refresh(): void {
    this._click$.next();
  }

  updateStatus(order: IOrder, index: number): void {

    const { status, orderRequestId } = order;

    this.updateOrderForm.reset({ status, orderRequestId: `${orderRequestId}` });
    this.editingIndex.set(index);
    this.isEditing.set(true);
    this.selectedOrder.set(order);

    this.options.set(this.getOptions());

  }

  cancelEdit(): void {
    this.editingIndex.set(-1);
    this.isEditing.set(false);
    this.updateOrderForm.reset();
    this.selectedOrder.set(undefined);
    this.options.set([]);
  }

  imageHasError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = '/icon/image_placeholder.svg';
  }

  handlePageChange({ forceUpdate, first }: TableLazyLoadEvent): void {

    if (this.firstTimeLoading()) {
      this.firstTimeLoading.set(false);
      return;
    }

    if (this.first() === first && !this.firstTimeLoading()) return;

    const currentPage: number = Math.floor((first ?? 0) / 11);
    this.first.set(first!);

    this.isLoading.set(true);

    const subscription: Subscription = this._orderApiService.getAll(currentPage)
      .pipe(
        catchError((error: any): Observable<any> => {
          this.showError(error, 'Hubo un problema con la peticion.');
          return throwError((): any => error);
        }),
        finalize((): void => {
          this.isLoading.set(false);
          if (forceUpdate) forceUpdate();
        }),
      )
      .subscribe({
        next: (response: Pagination<IOrder[]>): void => this.updateTable(response),
      });

    this.addSubscription(subscription);

  }

  update(): void {

    const { status, orderRequestId } = this.updateOrderForm.value;

    if (status === this.selectedOrder()!.status) return;

    this._spinnerService.show();

    const transformedStatus: string = this._statusPipe.transform(status as Status);

    const subscription: Subscription = this._orderApiService.updateStatus(status as Status, +orderRequestId!)
      .pipe(
        catchError((error: any): Observable<any> => {
          this.showError(error, 'Hubo un problema con la peticion.');
          return throwError((): any => error);
        }),
        finalize((): void => this._spinnerService.hide()),
      )
      .subscribe({
        next: (): void => {
          this.refresh();
          this.cancelEdit();
          this.successHandler('Estatus actualizado!', `Se ha cambiado el estatus a ${transformedStatus}`)
        },
      });

    this.addSubscription(subscription);

  }

  private initializeComponent(): void {
    this.paginationOrder = signal<Pagination<IOrder[]>>(this._activatedRoute.snapshot.data['orderList']);
    this.orderList.set(this.paginationOrder().content);
    this.defineRefreshBehaviour();
    this.defineSearchBehavior();
  }

  private updateTable(data: Pagination<IOrder[]>): void {
    this.paginationOrder.set(data);
    this.orderList.set(this.paginationOrder().content);
  }

  private addSubscription(subscription: Subscription): void {
    this.subscription.update((prev: Subscription[]): Subscription[] => [...prev, subscription]);
  }

  private showError(error: any, title: string): void {

    MODAL_ERROR_DEFAULT.data = {
      message: error?.error?.message ?? 'Algo salio mal',
      title,
    };

    this._modalHandlerService.handleError({ modalSettings: MODAL_ERROR_DEFAULT });
    this.orderForm.reset();
  }

  private defineRefreshBehaviour(): void {

    const subscription: Subscription = this._click$
      .pipe(
        debounceTime(300),
      )
      .subscribe({
        next: (): void => this.handleRefresh(),
      });

    this.addSubscription(subscription);

  }

  private handleRefresh(): void {

    this._spinnerService.show();
    this.first.set(0);

    const subscription: Subscription = this._orderApiService.getAll()
      .pipe(
        catchError((error: any): Observable<any> => {
          this.showError(error, 'Hubo un problema con la peticion.');
          return throwError((): any => error);
        }),
        finalize((): void => this._spinnerService.hide()),
      )
      .subscribe({
        next: (response: Pagination<IOrder[]>): void => this.updateTable(response),
      });

    this.addSubscription(subscription);
  }

  private unsubscribeAll(): void {
    this.subscription().forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

  private defineSearchBehavior(): void {

    const subscription: Subscription | undefined = this.orderForm.get('search')?.valueChanges
      .pipe(
        debounceTime(1000),
      )
      .subscribe({
        next: (value): void => this.handleSearch(value ?? ''),
      });

    if (subscription) this.addSubscription(subscription);

  }

  private handleSearch(value: string): void {

    if (value.trim() === '') {
      this.searchOrderList.set([]);
      return;
    }

    this._spinnerService.show();

    const subscription: Subscription = this._orderApiService.find(value)
      .pipe(
        catchError((error: any): Observable<any> => {
          this.showError(error, 'Hubo un problema con la peticion.');
          return throwError((): any => error);
        }),
        finalize((): void => this._spinnerService.hide()),
      )
      .subscribe({
        next: (response: IOrder[]): void => {

          if (response.length === 0) {
            this.showError({ error: { message: 'La busqueda trajo 0 coincidencias.' } }, 'No se encontraron coincidencias');
            return;
          }

          this.searchOrderList.set(response);
        },
      });

    this.addSubscription(subscription);

  }

  private getOptions(): SelectItem[] {

    const { status } = this.updateOrderForm.value;

    const transformedStatus: string = this._statusPipe.transform(status as Status);

    switch (status as Status) {
      case 'PENDING':
        return [
          {
            label: transformedStatus,
            value: status,
            disabled: true,
          },
          {
            label: 'En ruta',
            value: 'ON_ROUTE'
          },
          {
            label: 'Cancelar',
            value: 'CANCELLED'
          },
        ];
      case 'ON_ROUTE':
        return [
          {
            label: transformedStatus,
            value: status,
            disabled: true,
          },
          {
            label: 'Entregada',
            value: 'DELIVERED',
          },
          {
            label: 'Cancelar',
            value: 'CANCELLED'
          }
        ];
      default:
        return [{ label: transformedStatus, value: status, disabled: true, }];
    }

  }

  private successHandler(summary: string, detail: string, life: number = 4000): void {
    this._primengMessageService.add({ severity: 'success', summary, detail, life });
  }

}
