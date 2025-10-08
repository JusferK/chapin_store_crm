import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable()
export class PrefixInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith('http') && !req.url.startsWith('/service')) {
      const apiReq = req.clone({ url: `/service${req.url}` });
      return next.handle(apiReq);
    }

    return next.handle(req);
  }

}
