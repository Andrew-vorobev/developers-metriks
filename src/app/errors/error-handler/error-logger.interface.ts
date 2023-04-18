import { InjectionToken } from '@angular/core';

export interface IErrorLogger {
  log(error: Error): void;
}

export const ERROR_LOGGER: InjectionToken<string> =
  new InjectionToken<IErrorLogger>('ERROR_LOGGER');
