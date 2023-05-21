import { Injectable } from '@angular/core';
import { IErrorLogger } from '../error-logger.interface';

@Injectable({
  providedIn: 'root',
})
export class ErrorConsoleLoggerService implements IErrorLogger {
  public log(error: Error): void {
    console.warn('Some error has occurred', error);
  }
}
