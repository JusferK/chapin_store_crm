import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserManagerService } from '../../../services/execute/user-manager.service';
import { SessionManagerService } from '../../../services/execute/session-manager.service';
import { debounce, debounceTime, filter, finalize, Subscription, tap } from 'rxjs';
import { GeneralRoutes, PrivateRoutes } from '../../../enum/routes.enum';
import { UtilService } from '../../../services/execute/util.service';

@Component({
  selector: 'app-main-frame',
  standalone: false,
  templateUrl: './main-frame.component.html',
  styleUrl: './main-frame.component.scss'
})
export class MainFrameComponent implements OnInit, OnDestroy {

  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _userManagerService: UserManagerService = inject(UserManagerService);
  private _sessionManagerService: SessionManagerService = inject(SessionManagerService);
  private _router: Router = inject(Router);
  private _utilService: UtilService = inject(UtilService);

  label: WritableSignal<string> = signal(this._userManagerService.getAvatarLabel());

  items: WritableSignal<MenuItem[]> = signal([]);
  subscriptions: WritableSignal<Subscription[]> = signal<Subscription[]>([]);

  ngOnInit(): void {
    this.initMenuList();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  profile(): void {
    this._router.navigate([PrivateRoutes.PROFILE])
      .finally((): void => {});
  }

  welcome(): void {
    this._router.navigate([GeneralRoutes.HOME])
    .finally((): void => {});
  }

  logout(): void {
    const subscription: Subscription = this._sessionManagerService.logout()
      .subscribe();

    this.subscriptions.update((prev: Subscription[]): Subscription[] => [...prev, subscription]);
  }

  private initMenuList(): void {
    const menuList = this._activatedRoute.snapshot.data['menuList'] as MenuItem[];
    this.items.set(menuList);
  }

  private unsubscribe(): void {
    this.subscriptions().forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

}
