import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserManagerService } from '../execute/user-manager.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionInitializerService {

  private tokenWasExpired: boolean = false;

  private _httpClient: HttpClient = inject(HttpClient);

  set setTokenWasExpired(tokenWasExpired: boolean) {
    this.tokenWasExpired = tokenWasExpired;
  }

  get getTokenWasExpired(): boolean {
    return this.tokenWasExpired;
  }

  async validate(): Promise<void> {

    const data: string = localStorage.getItem('userSession') ?? '{}';

    if (data === '{}') return;

    const token: string = JSON.parse(data).jwt;
    const url: string = environment.appInitializerUrl;

    try {
      await firstValueFrom(
        this._httpClient.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
    } catch (error) {
      console.error(error);
      localStorage.clear();
      this.setTokenWasExpired = true;
    }
  }

}
