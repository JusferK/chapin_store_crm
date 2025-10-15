import { Component, inject, linkedSignal, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Pagination } from '../../../../interface/pagination.interface';
import { IProduct } from '../../../../interface/model.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  Observable,
  Subject,
  Subscription,
  throwError
} from 'rxjs';
import { ProductApiService } from '../../services/transactional/product-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalHandlerService } from '../../../../services/execute/modal-handler.service';
import { MODAL_ERROR_DEFAULT, MODAL_WARNING_DEFAULT } from '../../../../settings/modals/modal-default-settings';
import { DataInjectionManagerService } from '../../../../services/execute/data-injection-manager.service';
import { ProductKeyDataNavigation } from '../../enum/product-module-data-key-navigation.interface';
import { ProductModuleNavigation } from '../../enum/product-module-navigation.interface';
import { SpinnerService } from '../../../../services/execute/spinner.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, OnDestroy {

  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _productApiService: ProductApiService = inject(ProductApiService);
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _modalHandlerService: ModalHandlerService = inject(ModalHandlerService);
  private readonly _click$: Subject<void> = new Subject<void>();
  private readonly _dataInjectionManagerService: DataInjectionManagerService = inject(DataInjectionManagerService);
  private readonly _router: Router = inject(Router);
  private readonly _spinnerService: SpinnerService = inject(SpinnerService);
  private readonly _primengMessageService: MessageService = inject(MessageService);

  searchProductForm: FormGroup = this._formBuilder.group({
    search: ['', [Validators.required]],
  });

  paginationProducts!: WritableSignal<Pagination<IProduct[]>>;
  products: WritableSignal<IProduct[]> = signal<IProduct[]>([]);
  product: WritableSignal<IProduct | undefined> = signal<IProduct | undefined>(undefined);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  firstTimeLoading: WritableSignal<boolean> = signal<boolean>(true);

  subscriptions: WritableSignal<Subscription[]> = signal<Subscription[]>([]);

  value: WritableSignal<IProduct[]> = linkedSignal<IProduct[]>((): IProduct[] => this.product() !== undefined ? [this.product()] as IProduct[] : this.products());

  ngOnInit(): void {
    this.initializeProducts();
    this.defineSearchBehaviour();
    this.refreshBehaviour();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  onClick(): void {
    this._click$.next();
  }

  update(product: IProduct): void {

    MODAL_WARNING_DEFAULT.data = {
      message: '',
      title: '¿Quieres actualizar este producto?',
    }

    const { closed$ } = this._modalHandlerService
       .handleWarning({ handler: (result: boolean): void => this.handleUpdate(result, product) });

    const subscription: Subscription = closed$.subscribe();

    this.addSubscription(subscription);
  }

  delete(product: IProduct): void {

    MODAL_WARNING_DEFAULT.data = {
      title: 'Estas apunto de remover este producto',
      message: '¿Deseas continuar?'
    };

    const { closed$ } = this._modalHandlerService.handleWarning({
      modalSettings: MODAL_WARNING_DEFAULT,
      handler: (result: boolean): void => {
        if (!result) return;
        this.handleRemove(product);
      }
    });

    this.addSubscription(closed$.subscribe());

  }

  handlePageChange({ forceUpdate, first }: TableLazyLoadEvent): void {

    if (this.firstTimeLoading()) {
      this.firstTimeLoading.set(false);
      return;
    }

    this.isLoading.set(true);

    const currentPage: number = (first ?? 0) / this.paginationProducts().size;

    const subscription: Subscription = this._productApiService.getAllProducts(currentPage)
      .pipe(
        catchError((error: any) => {
          this.errorHandler('Hubo un fallo en la transaccion', error?.error?.message ?? 'Ha ocurrido un error, por favor intenta mas tarde.');
          return throwError(() => error);
        }),
        finalize((): void => {
          this.isLoading.set(false);
          if (forceUpdate) forceUpdate();
        }),
      ).subscribe({
      next: (response: Pagination<IProduct[]>): void => this.handleResponse(response),
    });

    this.addSubscription(subscription);
  }

  private initializeProducts(): void {
    const data: Pagination<IProduct[]> = this._activatedRoute.snapshot.data['products'];
    this.paginationProducts = signal<Pagination<IProduct[]>>(data);
    this.products.set(data.content);
  }

  private handleResponse(data: Pagination<IProduct[]>): void {
    this.paginationProducts.set(data);
    this.products.set(data.content);
  }

  private defineSearchBehaviour(): void {
    const subscription: Subscription | undefined = this.searchProductForm.get('search')?.valueChanges
      .pipe(
        distinctUntilChanged(),
        map((value: string): string => {
          if (value.trim() === '') this.product.set(undefined);
          return value;
        }),
        debounceTime(900),
      )
      .subscribe({
        next: (search: string): void => this.handleSearch(search),
      });

    if (subscription) this.addSubscription(subscription);
  }

  private handleSearch(value: string): void {

    if (value.trim() === '') return;

    this.isLoading.set(true);

    const subscription: Subscription = this._productApiService.getProduct(value)
      .pipe(
        catchError((error: any): Observable<any> => {
          this.handleError(error);
          this.isLoading.set(false);
          return throwError((): any => error);
        })
      )
      .subscribe({
        next: (response: IProduct): void => {
          this.product.set(response);
          this.isLoading.set(false);
        },
      });

    this.addSubscription(subscription);
  }

  private handleError(error: any): void {

    MODAL_ERROR_DEFAULT.data = {
      message: error?.error?.message ?? 'Algo salio mal',
      title: 'No hubo coincidencias'
    };

    this._modalHandlerService.handleError({ modalSettings: MODAL_ERROR_DEFAULT });
    this.searchProductForm.reset();
  }

  private addSubscription(subscription: Subscription): void {
    this.subscriptions.update((prev: Subscription[]): Subscription[] => {
      prev.push(subscription);
      return prev;
    });
  }

  private refresh(): void {

    this.isLoading.set(true);

    const subscription: Subscription = this._productApiService.getAllProducts()
      .pipe(
        catchError((error: any) => {
          this.errorHandler('Hubo un fallo en la transaccion', error?.error?.message ?? 'Ha ocurrido un error, por favor intenta mas tarde.');
          return throwError(() => error);
        }),
        finalize((): void => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response: Pagination<IProduct[]>): void => this.handleResponse(response),
      });

    this.addSubscription(subscription);
  }

  private refreshBehaviour(): void {

    const subscription: Subscription = this._click$
      .pipe(
        debounceTime(800),
      )
      .subscribe({
        next: (): void => this.refresh(),
      });

    this.addSubscription(subscription);

  }

  private unsubscribeAll(): void {
    this.subscriptions().forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

  private handleUpdate(result: boolean, product: IProduct): void {
    if (!result) return;

    this._dataInjectionManagerService.save(ProductKeyDataNavigation.PRODUCT_UPDATE_KEY, product);
    this._router.navigate([ProductModuleNavigation.UPDATE])
      .finally((): void => {});

  }

  private handleRemove({ productId }: IProduct): void {

    this._spinnerService.show();

    const subscription: Subscription = this._productApiService.remove(productId!)
      .pipe(
        catchError((error: any) => {
          this.errorHandler('Hubo un fallo en la transaccion', error?.error?.message ?? 'Ha ocurrido un error, por favor intenta mas tarde.');
          return throwError(() => error);
        }),
        finalize(() => this._spinnerService.hide()),
      )
      .subscribe({
        next: (): void => this.removeFromView(productId!),
      });

    this.addSubscription(subscription);

  }

  private removeFromView(id: number): void {
    this.products.update((prev: IProduct[]): IProduct[] => {
      return prev.filter((product: IProduct): boolean => product.productId !== id);
    });

    this.successHandler('Producto eliminado', `El producto con el id ${id}, fue removido.`, 7000);
  }

  private successHandler(summary: string, detail: string, life: number = 4000): void {
    this._primengMessageService.add({ severity: 'success', summary, detail, life });
  }

  private errorHandler(summary: string, detail: string, life: number = 6000): void {
    this._primengMessageService.add({ severity: 'error', summary, detail, life });
  }

}
