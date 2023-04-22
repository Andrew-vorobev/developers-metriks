import { Injectable } from '@angular/core';
import { IErrorLogger } from '../error-logger.interface';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorNotificationService implements IErrorLogger {
  private _notify: Subject<Error> = new Subject<Error>();
  public notified$: Observable<Error> = this._notify.asObservable();

  public log(error: Error): void {
    this._notify.next(error);
  }
}
