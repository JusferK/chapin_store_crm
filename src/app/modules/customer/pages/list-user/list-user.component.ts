import { Component, inject, linkedSignal, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ICustomer } from '../../../../interface/model.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { TableLazyLoadEvent } from 'primeng/table';
import { Pagination } from '../../../../interface/pagination.interface';
import { ActivatedRoute } from '@angular/router';
import { catchError, debounceTime, finalize, Observable, Subject, Subscription, throwError } from 'rxjs';
import { CustomerApiService } from '../../services/transactional/customer-api.service';
import { MODAL_ERROR_DEFAULT, MODAL_WARNING_DEFAULT } from '../../../../settings/modals/modal-default-settings';
import { ModalHandlerService } from '../../../../services/execute/modal-handler.service';
import { SpinnerService } from '../../../../services/execute/spinner.service';
import { MessageService } from 'primeng/api';
import { iMaskEmail } from '../../../../constants/imask.constant';

@Component({
  selector: 'app-list-user',
  standalone: false,
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss'
})
export class ListUserComponent implements OnInit, OnDestroy {


  private readonly _formBuilder: FormBuilder = new FormBuilder();
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _customerApiService: CustomerApiService = inject(CustomerApiService);
  private readonly _modalHandlerService: ModalHandlerService = inject(ModalHandlerService);
  private readonly _spinnerService: SpinnerService = inject(SpinnerService);
  private readonly _primengMessageService: MessageService = inject(MessageService)

  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  paginationCustomer!: WritableSignal<Pagination<ICustomer[]>>;
  customerList: WritableSignal<ICustomer[]> = linkedSignal((): ICustomer[] => this.paginationCustomer().content);
  unique: WritableSignal<ICustomer | null> = signal<ICustomer | null>(null);
  firstTimeLoading: WritableSignal<boolean> = signal<boolean>(true);
  first: WritableSignal<number> = signal<number>(0);

  list: WritableSignal<ICustomer[]> = linkedSignal((): ICustomer[] => this.unique() ? [this.unique()] as ICustomer[] : this.customerList());

  private readonly _click$: Subject<void> = new Subject<void>();

  private subscription: WritableSignal<Subscription[]> = signal<Subscription[]>([]);

  emailMask = iMaskEmail;

  searchCustomerForm = this._formBuilder.group({
    search: [''],
  });

  ngOnInit(): void {
    this.initializeComponent();
    this.defineSearchBehaviour();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  delete(customer: ICustomer): void {

    MODAL_WARNING_DEFAULT.data = {
      title: 'Estas apunto de remover a este usuario',
      message: '¿Deseas continuar?',
    };

    const { closed$ } = this._modalHandlerService.handleWarning({
      modalSettings: MODAL_WARNING_DEFAULT,
      handler: (result: boolean): void => {
        if (!result) return;
        this.handleRemove(customer);
      }
    });

    this.addSubscription(closed$.subscribe());

  }

  onRefresh(): void {
    this._click$.next();
  }

  handlePageChange({ forceUpdate, first }: TableLazyLoadEvent): void {

    if (this.firstTimeLoading()) {
      this.firstTimeLoading.set(false);
      return;
    }

    if (this.first() === first && !this.firstTimeLoading()) return;

    this.isLoading.set(true);

    const currentPage: number = Math.floor((first ?? 0) / 20);
    this.first.set(first!);

    const subscription: Subscription = this.getAll(currentPage)
      .pipe(
        catchError((error: any) => {
          this.errorHandler('Hubo un fallo en la transaccion', error?.error?.message ?? 'Ha ocurrido un error, por favor intenta mas tarde.');
          return throwError(() => error);
        }),
        finalize((): void => {
          this.isLoading.set(false);
          if (forceUpdate) forceUpdate();
        })
      )
      .subscribe({
        next: (response: Pagination<ICustomer[]>): void => this.handleRefresh(response),
      });

    this.addSubscription(subscription);

  }

  imageHasError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = '/icon/image_placeholder.svg';
  }

  private handleRefresh(response: Pagination<ICustomer[]>): void {
    this.paginationCustomer.set(response);
    this.customerList.set(this.paginationCustomer().content);
  }

  private defineSearchBehaviour(): void {
    const subscription: Subscription = this.searchCustomerForm.valueChanges
      .pipe(
        debounceTime(800),
      )
      .subscribe({
        next: ({ search }): void => this.handleSearch(search!),
      });

    this.addSubscription(subscription);
  }

  private initializeComponent(): void {
    this.paginationCustomer = signal(this._activatedRoute.snapshot.data['customerList']);
    this.defineRefreshBehavior();
  }

  private addSubscription(subscription: Subscription): void {
    this.subscription.update((prev: Subscription[]): Subscription[] => [...prev, subscription]);
  }

  private defineRefreshBehavior(): void {
    const subscription: Subscription = this._click$
      .pipe(
        debounceTime(400),
      )
      .subscribe({
        next: (): void => this.refresh(),
      });

    this.addSubscription(subscription);
  }

  private refresh(): void {

    this.isLoading.set(true);
    this.first.set(0);

    this.getAll()
      .pipe(
        catchError((error: any): Observable<any> => {
          this.errorHandler('Hubo un fallo en la transaccion', error?.error?.message ?? 'Ha ocurrido un error, por favor intenta mas tarde.');
          return throwError((): any => error);
        }),
        finalize((): void =>  this.isLoading.set(false)),
      )
      .subscribe({
        next: (response: Pagination<ICustomer[]>): void => this.handleRefresh(response),
      });
  }

  private getAll(page: number = 0): Observable<Pagination<ICustomer[]>> {
    return this._customerApiService.getAll(page);
  }

  private handleRemove({ email }: ICustomer): void {

    this._spinnerService.show();

    const subscription: Subscription = this._customerApiService.delete(email)
      .pipe(
        catchError((error: any): Observable<any> => {
          this.errorHandler('Hubo un fallo en la transaccion', error?.error?.message ?? 'Ha ocurrido un error, por favor intenta mas tarde.');
          return throwError(() => error);
        }),
        finalize((): void => this._spinnerService.hide())
      )
      .subscribe({
        next: (): void => this.removeFromView(email),
      });

    this.addSubscription(subscription);

  }

  private removeFromView(email: string): void {
    this.customerList.update((prev: ICustomer[]): ICustomer[] => prev.filter((customer: ICustomer): boolean => customer.email !== email));
  }

  private errorHandler(summary: string, detail: string, life: number = 6000): void {
    this._primengMessageService.add({ severity: 'error', summary, detail, life });
  }

  private showError(error: any): void {

    MODAL_ERROR_DEFAULT.data = {
      message: error?.error?.message ?? 'Algo salio mal',
      title: 'No hubo coincidencias'
    };

    this._modalHandlerService.handleError({ modalSettings: MODAL_ERROR_DEFAULT });
    this.searchCustomerForm.reset();
  }

  private unsubscribeAll(): void {
    this.subscription().forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

  private handleSearch(search: string): void {

    if (search.trim() === '') {
      this.unique.set(null);
      return;
    }

    const subscription: Subscription = this._customerApiService.get(search)
      .pipe(
        catchError((error: any): Observable<any> => {
          this.showError(error);
          return throwError((): any => error);
        }),
        finalize((): void =>  this.isLoading.set(false)),
      )
      .subscribe({
        next: (response: ICustomer): void => this.unique.set(response),
      });

    this.addSubscription(subscription);

  }

}
