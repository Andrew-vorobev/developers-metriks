import { ErrorHandler, Inject, Injectable, NgZone } from '@angular/core';
import { ERROR_LOGGER, IErrorLogger } from './error-logger.interface';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(
    @Inject(ERROR_LOGGER) private errorLogger: IErrorLogger,
    private zone: NgZone
  ) {}

  handleError(error: Error) {
    this.zone.run(() => this.errorLogger.log(error));
  }
}
