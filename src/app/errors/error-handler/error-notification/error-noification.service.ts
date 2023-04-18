import { Injectable } from '@angular/core';
import { IErrorLogger } from '../error-logger.interface';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorNotificationService implements IErrorLogger {
  private notify: Subject<Error> = new Subject<Error>();
  public notified$: Observable<Error> = this.notify.asObservable();

  log(error: Error): void {
    this.notify.next(error);
  }
}
