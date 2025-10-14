import { Component, inject, linkedSignal, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { ICategory, IProduct } from '../../../../interface/model.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductComponentMode } from '../../enum/product-module-data-key-navigation.interface';
import { debounceTime, finalize, Subscription, timer } from 'rxjs';
import { UtilService } from '../../../../services/execute/util.service';
import { ProductApiService } from '../../services/transactional/product-api.service';
import { ProductModuleNavigation } from '../../enum/product-module-navigation.interface';
import { ModalHandlerService } from '../../../../services/execute/modal-handler.service';
import { MODAL_SUMMARY_DEFAULT, MODAL_WARNING_DEFAULT } from '../../../../settings/modals/modal-default-settings';
import { SpinnerService } from '../../../../services/execute/spinner.service';
import { ISelect } from '../../../../interface/prime-ng.interface';
import { MapperService } from '../../../../services/execute/mapper.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit, OnDestroy {

  private _formBuilder: FormBuilder = inject(FormBuilder);

  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _utilService: UtilService = inject(UtilService);
  private readonly _productApiService: ProductApiService = inject(ProductApiService);
  private readonly _router: Router = inject(Router);
  private readonly _modalHandler: ModalHandlerService = inject(ModalHandlerService);
  private readonly _spinnerService: SpinnerService = inject(SpinnerService);
  private readonly _mapperService: MapperService = inject(MapperService);
  private readonly _primengMessageService: MessageService = inject(MessageService);

  private product?: WritableSignal<IProduct>;
  image: WritableSignal<string> = signal<string>('/icon/image_placeholder.svg');
  subscriptions: WritableSignal<Subscription[]> = signal<Subscription[]>([]);
  imageHasError: WritableSignal<boolean> = signal(true);
  categoryList: WritableSignal<ICategory[]> = signal<ICategory[]>([]);
  categoryOptions: WritableSignal<ISelect[]> = linkedSignal((): ISelect[] => this._mapperService.formatSelectItems({ keyName: 'name', optionalKeyName: 'categoryId', keyCode: 'categoryId' }, this.categoryList()));

  private componentMode: WritableSignal<ProductComponentMode> = signal(ProductComponentMode.CREATE);

  title: WritableSignal<string> = linkedSignal((): string => {
    return this.componentMode() === ProductComponentMode.EDIT ? (
      `Te encuentras editando el producto: ${this.product!().name} - ${this.product!().productId}`
    ) : (
      'Agrega un producto nuevo'
    );
  });

  productForm: FormGroup = this._formBuilder.group({
    categoryId: ['', Validators.required],
    description: ['', Validators.required],
    image: ['', Validators.required],
    name: ['', Validators.required],
    price: ['', Validators.required],
    stock: ['', Validators.required],
    productId: ['', Validators.required],
  });

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  imageErrorHandler(): void {
    this.image.set('/icon/image_placeholder.svg');
    this.imageHasError.set(true);
  }

  onSubmit(): void {

    if (this.productForm.invalid) return;

    if (this.componentMode() === ProductComponentMode.EDIT) {
      this.validateBody();
      return;
    }

    this.registerProduct();

  }

  back(): void {
    this._router.navigate([ProductModuleNavigation.HOME])
      .finally((): void => {});
  }

  private initializeComponent(): void {

    this.setImageBehaviour();
    this.getCategories();
    this.getMode();

    if (this.componentMode() === ProductComponentMode.EDIT) {
      this.getProduct();
      return;
    }

    this.removeId();

  }

  private removeId(): void {
    this.productForm.removeControl('productId');
  }

  private getProduct(): void {
    this.product = signal<IProduct>(this._activatedRoute.snapshot.data['product']);
    this.productForm.reset(this.product());
  }

  private getCategories(): void {
    this.categoryList.set(this._activatedRoute.snapshot.data['category']);
  }

  private setImageBehaviour(): void {

    const subscription: Subscription | undefined = this.productForm.get('image')?.valueChanges
      .pipe(
        debounceTime(400),
      )
      .subscribe({
        next: (value: string): void => this.handleImageChange(value),
      });

    if (subscription) this.addSubscription(subscription);

  }

  private getMode(): void {
    const subscription: Subscription = this._activatedRoute.data
      .subscribe({
        next: (data: Data): void => this.componentMode.set(data['mode']),
      });

    this.addSubscription(subscription);
  }

  private handleImageChange(value: string): void {

    if (value.trim() === '') {
      this.image.set('/icon/image_placeholder.svg');
      this.imageHasError.set(true);
      return;
    }

    this.image.set(value);
    this.imageHasError.set(false);

  }

  private addSubscription(subscription: Subscription): void {
    this.subscriptions.update((prev: Subscription[]): Subscription[] => [...prev, subscription]);
  }

  private validateBody(): void {

    const body: IProduct = this._utilService
      .evaluateNewData<IProduct>(this.productForm.value, this.product!());

    if (Object.keys(body).length === 0) {
      this.noChangesHandler();
      return;
    }

    const { closed$ } = this._modalHandler.handleSummary<IProduct>({
      newData: body,
      oldData: this.product!(),
      handler: (result: boolean): void => {
        if (!result) return;
        this.edit(body);
      },
    });

    this.addSubscription(closed$.subscribe());

  }

  private edit(body: IProduct): void {

    this._spinnerService.show();

    const subscription: Subscription = this._productApiService.editProduct({ ...body, productId: this.product!().productId })
      .pipe(
        finalize((): void =>  this._spinnerService.hide())
      )
      .subscribe({
        next: (): void => this.successHandler('Transaccion realizada.', 'El producto ha sido editado exitosamente'),
      });

    this.addSubscription(subscription);
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

  private unsubscribeAll(): void {
    this.subscriptions().forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

  private registerProduct(): void {

    this._spinnerService.show();

    MODAL_SUMMARY_DEFAULT.data = {
      title: `Estas apunto de agregar este producto`
    };

    const { closed$ } = this._modalHandler.handleSummary<IProduct>({
      newData: this.productForm.value,
      handler: (result: boolean): void => {
        if (!result) return;
        this.add();
      },
      modalSettings: MODAL_SUMMARY_DEFAULT,
    });

    this.addSubscription(closed$.subscribe());
  }

  private add(): void {

    const subscription: Subscription = this._productApiService.add(this.productForm.value)
      .pipe(
        finalize((): void =>  this._spinnerService.hide()),
      )
      .subscribe({
        next: (data: IProduct): void => this.successAdditionHandler(data),
      });

    this.addSubscription(subscription);

  }

  private successAdditionHandler(data: IProduct): void {
    this.successHandler('Producto guardado', `Se ha registrado el product con el id ${data.productId}`, 10000);
    const subscription2: Subscription = timer(3000)
      .subscribe({
        next: (): void => {
          this._router.navigate([ProductModuleNavigation.HOME])
            .finally((): void => {})
        }
      });

    this.addSubscription(subscription2);

    this.productForm.disable();
  }

  private successHandler(summary: string, detail: string, life: number = 4000): void {
    this._primengMessageService.add({ severity: 'success', summary, detail, life: 4000 });
  }

}
