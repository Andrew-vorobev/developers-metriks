import { ErrorHandler, Inject, Injectable, NgZone } from '@angular/core';
import { ERROR_LOGGER, IErrorLogger } from './error-logger.interface';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(
    @Inject(ERROR_LOGGER) private _errorLogger: IErrorLogger,
    private _zone: NgZone
  ) {}

  public handleError(error: Error) {
    this._zone.run(() => this._errorLogger.log(error));
  }
}
