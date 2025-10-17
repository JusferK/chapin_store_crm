import { Component, computed, inject, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { IAdministrator, RegisterAdministrator } from '../../../../interface/model.interface';
import { ActivatedRoute } from '@angular/router';
import { catchError, debounceTime, delay, finalize, map, Observable, Subject, Subscription, throwError } from 'rxjs';
import { AdministratorApiService } from '../../services/transactional/administrator-api.service';
import { SpinnerService } from '../../../../services/execute/spinner.service';
import { MODAL_ERROR_DEFAULT, MODAL_WARNING_DEFAULT } from '../../../../settings/modals/modal-default-settings';
import { ModalHandlerService } from '../../../../services/execute/modal-handler.service';
import { UserManagerService } from '../../../../services/execute/user-manager.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { iMaskUsername } from '../../../../constants/imask.constant';
import { ModalService } from '../../../../services/execute/modal.service';
import { AdministratorFormComponent } from '../../components/administrator-form/administrator-form.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IPButton } from '../../../primeng/interface/primeng-components.interface/primeng-components.interface';
import { MessageService } from 'primeng/api';
import { RolApiService } from '../../../security/modules/rol/services/transactional/rol-api.service';

@Component({
  selector: 'app-list-administrator',
  standalone: false,
  templateUrl: './list-administrator.component.html',
  styleUrl: './list-administrator.component.scss'
})
export class ListAdministratorComponent implements OnInit, OnDestroy {

  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _administratorApiService: AdministratorApiService = inject(AdministratorApiService);
  private readonly _spinnerService: SpinnerService = inject(SpinnerService);
  private readonly click$: Subject<void> = new Subject<void>();
  private readonly _modalHandlerService: ModalHandlerService = inject(ModalHandlerService);
  private readonly _userManagerService: UserManagerService = inject(UserManagerService);
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _modalService: ModalService = inject(ModalService);
  private readonly _primengMessageService: MessageService = inject(MessageService);
  private readonly _rolApiService: RolApiService = inject(RolApiService);

  subscriptions: WritableSignal<Subscription[]> = signal<Subscription[]>([]);

  administratorList: WritableSignal<IAdministrator[]> = signal<IAdministrator[]>([]);
  administratorSearchList: WritableSignal<IAdministrator[]> = signal<IAdministrator[]>([]);

  adminList: Signal<IAdministrator[]> = computed((): IAdministrator[] => {
    return this.administratorSearchList().length > 0 ? this.administratorSearchList() : this.administratorList()
  });

  searchAdminForm: FormGroup = this._formBuilder.group({
    search: [''],
  });

  searchMask = iMaskUsername;

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

  onRefresh(): void {
    this.click$.next();
  }

  add(): void {

    this._spinnerService.show();

    const subscription: Subscription = this._rolApiService.getAll()
      .pipe(
        map((response: string[]): string[] => response.filter((value: string): boolean => value !== 'CUSTOMER')),
        finalize((): void => this._spinnerService.hide()),
      )
      .subscribe({
        next: (response: string[]): void => this.openModalCreateAdminForm(response),
      });

    this.addSubscription(subscription);

  }

  updatePassword(administrator: IAdministrator): void {
    this.openModalUpdatePassword(administrator);
  }

  delete({ username }: IAdministrator): void {

    MODAL_WARNING_DEFAULT.data = {
      message: '',
      title: '¿Quieres desactivar este administrador?',
    }

    const { closed$ } = this._modalHandlerService
      .handleWarning({ handler: (result: boolean): void => this.handleDisable(result, username) });

    this.addSubscription(closed$.subscribe());

  }

  getSeverity(enable: boolean) {

    switch (enable) {
      case true:
        return 'success';
      case false:
        return 'danger';
      default:
        return undefined;
    }

  }

  isSameUser(username: string): boolean {
    return this._userManagerService.getAdminData?.username === username;
  }

  private initializeComponent(): void {
    this.administratorList.set(this._activatedRoute.snapshot.data['administratorList']);
    this.defineRefreshBehavior();
    this.defineSearchBehavior();
  }

  private handleRefresh(): void {

    this._spinnerService.show();

    const subscription: Subscription = this._administratorApiService.getAll()
      .pipe(
        finalize((): void => this._spinnerService.hide()),
      )
      .subscribe((response: IAdministrator[]): void => {
        this.administratorList.set(response);
      });


    this.addSubscription(subscription);

  }

  private defineRefreshBehavior(): void {

    const subscription: Subscription = this.click$
      .pipe(
        debounceTime(400),
      )
      .subscribe({
        next: (): void => this.handleRefresh(),
      });


    this.addSubscription(subscription);

  }

  private defineSearchBehavior(): void {
    const subscription: Subscription | undefined = this.searchAdminForm.get('search')?.valueChanges
      .pipe(
        debounceTime(600),
      )
      .subscribe({
        next: (value: string): void => this.handleSearch(value),
      });

    if (subscription) this.addSubscription(subscription);
  }

  private handleDisable(result: boolean, username: string): void {

    if (!result) return;

    this._spinnerService.show();

    const subscription: Subscription = this._administratorApiService.disable(username)
      .pipe(
        catchError((error: any): Observable<any> => {
          this.showModalError(error?.error?.message);
          return throwError(() => error);
        }),
        finalize((): void => this._spinnerService.hide()),
      )
      .subscribe({
        next: (response: { disable: boolean }): void => this.updateViewFromDelete(response, username),
      });


    this.addSubscription(subscription);
  }

  private handleSearch(username: string): void {

    if (username.trim() === '') {
      this.administratorSearchList.set([]);
      return;
    }

    this._spinnerService.show();

    const subscription: Subscription = this._administratorApiService.get(username)
      .pipe(
        catchError((error: any): Observable<any> => {
          this.handleError(error);
          return throwError((): any => error);
        }),
        finalize((): void => this._spinnerService.hide()),
      )
      .subscribe({
        next: (response: IAdministrator): void => this.administratorSearchList.set([response]),
      });

    this.addSubscription(subscription);

  }

  private updateViewFromDelete({ disable }: { disable: boolean }, username: string): void {

    if (!disable) {
      this.showModalError();
      return;
    }

    this.administratorList.update((prev: IAdministrator[]): IAdministrator[] => {
      return prev.map((admin: IAdministrator): IAdministrator => {
        if (admin.username === username) return { ...admin, isActive: false };
        return { ...admin };
      });
    });

  }

  private showModalError(message: string = '', title: string = 'Algo salio mal'): void {

    MODAL_ERROR_DEFAULT.data = {
      message,
      title,
    };

    this._modalHandlerService.handleError({ modalSettings: MODAL_ERROR_DEFAULT });
  }

  private addSubscription(subscription: Subscription): void {
    this.subscriptions.update((prev: Subscription[]): Subscription[] => [...prev, subscription]);
  }

  private unsubscribeAll(): void {
    this.subscriptions().forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

  private handleError(error: any, title = 'No hubo coincidencias'): void {

    MODAL_ERROR_DEFAULT.data = {
      message: error?.error?.message ?? 'Algo salio mal',
      title,
    };

    this._modalHandlerService.handleError({ modalSettings: MODAL_ERROR_DEFAULT });
  }

  private handleAddition(result: boolean, admin: RegisterAdministrator | undefined): void {

    if (!result || !admin) return;

    this._spinnerService.show();

    const subscription: Subscription = this._administratorApiService.register(admin)
      .pipe(
        catchError((error: any) => {
          this.handleError(error, 'No se pudo agregar');
          return throwError(() => error);
        }),
        finalize((): void => this._spinnerService.hide()),
      )
      .subscribe({
        next: (response: IAdministrator): void => this.handleAdditionSuccess(response),
      });

    this.addSubscription(subscription);

  }

  private handleAdditionSuccess(admin: IAdministrator): void {
    this.administratorList.update((prev: IAdministrator[]): IAdministrator[] => [...prev, admin]);
    this.showSuccessMessage('Creacion exitosa!', `Se ha agregado el admin ${admin.username} con exito!`);
  }

  private showSuccessMessage(summary: string, detail: string, life: number = 4000): void {
    this._primengMessageService.add({ severity: 'success', summary, detail, life });
  }

  private openModalUpdatePassword(administrator: IAdministrator): void {

    const { username } = administrator

    const modalSettings: DynamicDialogConfig = {
      modal: true,
      draggable: false,
      resizable: false,
      style: {
        width: '500px',
        height: '400px',
      },
      data: {
        mode: 'UPDATE',
        administrator,
        buttonConfigurations: this.buttonsConfigurations,
        roles: [],
      },
    };

    const { closed$ } = this._modalService.open({
      component: AdministratorFormComponent,
      handler: ({ result, content }: { result: boolean, content: RegisterAdministrator | { password: string } | undefined }): void => this.handleEdit(result, content?.password ?? '', username),
      modalSettings,
    });

    this.addSubscription(closed$.subscribe());

  }

  private handleEdit(result: boolean, password: string, username: string): void {

    if (!result || password.trim() === '') return;

    this._spinnerService.show();

    const subscription: Subscription = this._administratorApiService.updatePassword({ username, password })
      .pipe(
        catchError((error: any) => {
          this.handleError(error, 'No se pudo editar');
          return throwError(() => error);
        }),
        finalize((): void => this._spinnerService.hide()),
      )
      .subscribe({
        next: ({ updated }: { updated: boolean }): void => this.handleEditSuccess(updated, username),
      });

    this.addSubscription(subscription);

  }

  private openModalCreateAdminForm(roles: string[]): void {

    const modalSettings: DynamicDialogConfig = {
      modal: true,
      draggable: false,
      resizable: false,
      style: {
        width: '500px',
        height: '400px',
      },
      data: {
        mode: 'CREATE',
        administrator: null,
        buttonConfigurations: this.buttonsConfigurations,
        roles,
      },
    };

    const { closed$ } = this._modalService.open({
      component: AdministratorFormComponent,
      handler: ({ result, content }: { result: boolean, content: RegisterAdministrator | undefined }): void => this.handleAddition(result, content),
      modalSettings,
    });

    this.addSubscription(closed$.subscribe());

  }

  private handleEditSuccess(updated: boolean, username: string): void {

    if (!updated) {
      return;
    }

    this.showSuccessMessage('Edicion exitosa!', `Se ha editado la contraseña con exito!`);

  }

}
