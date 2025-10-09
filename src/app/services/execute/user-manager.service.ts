import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { StorageManagerService } from './storage-manager.service';
import { AdministratorData } from '../../interface/model.interface';
import { StorageKeys } from '../../enum/storage-keys.enum';
import { LoginResponse } from '../../interface/api.interface';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService {

  private adminData: WritableSignal<AdministratorData | null> = signal<AdministratorData | null>(null);

  isUserAuthenticated: WritableSignal<boolean> = signal<boolean>(false);

  private _storageManagerService: StorageManagerService = inject(StorageManagerService);

  get getAdminData(): AdministratorData | null {
    return this.adminData();
  }

  set setAdminData(value: AdministratorData) {
    this.adminData.set(value);
  }

  evaluateAuthentication(): void {
    const administrator: AdministratorData = this._storageManagerService.retrieve<AdministratorData>(StorageKeys.USER_SESSION);

    if (administrator) {
      this.isUserAuthenticated.set(true);
      this.setAdminData = administrator;
    }

  }

  saveSession({ data, token }: LoginResponse): void {

    const formatAdminData: AdministratorData = {
      ...data,
      jwt: token,
    };

    this.adminData.set(formatAdminData);
    this._storageManagerService.save(formatAdminData, StorageKeys.USER_SESSION);
    this.isUserAuthenticated.set(true);
  }

  getToken(): string {
    return this.getAdminData?.jwt ?? '';
  }

  getAvatarLabel(): string {
    return this.getAdminData?.username.substring(0, 1).toUpperCase() ?? 'A';
  }

  logout(): void {
    this._storageManagerService.clear();
    this.isUserAuthenticated.set(false);
  }

}
