import { Injectable } from '@angular/core';
import { IErrorLogger } from '../error-logger.interface';

@Injectable({
  providedIn: 'root',
})
export class ErrorConsoleLoggerService implements IErrorLogger {
  log(error: Error): void {
    console.warn('Some error has occurred', error);
  }
}
