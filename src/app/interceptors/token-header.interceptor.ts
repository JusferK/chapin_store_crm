import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserManagerService } from '../services/execute/user-manager.service';

@Injectable()
export class TokenHeaderInterceptor implements HttpInterceptor {

  private readonly _userManagerService: UserManagerService = inject(UserManagerService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this._userManagerService.isUserAuthenticated()) return next.handle(req);

    const token: string = this._userManagerService.getToken();

    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const clonedReq: HttpRequest<any> = req.clone({ headers });

    return next.handle(clonedReq);
  }

}
