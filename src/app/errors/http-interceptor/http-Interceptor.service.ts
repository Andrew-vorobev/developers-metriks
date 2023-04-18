import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, of, retry } from 'rxjs';
import {
  ERROR_LOGGER,
  IErrorLogger,
} from '../error-handler/error-logger.interface';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(@Inject(ERROR_LOGGER) private errorLogger: IErrorLogger) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry({
        count: 2,
        delay: 2000,
      }),
      catchError(error => {
        return of(error);
      })
    );
  }
}
