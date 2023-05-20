import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorNotificationService } from './error-noification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-notification',
  templateUrl: 'error-notification.component.html',
  styleUrls: ['error-notification.component.css'],
})
export class ErrorNotificationComponent implements OnInit, OnDestroy {
  protected error: Error;
  protected httpResponseErrorMessage: string;
  protected elClassList: string[] = ['error-notification'];
  private _notifySubscription: Subscription;
  private _isOpened = false;

  constructor(private _errorNotificationService: ErrorNotificationService) {}

  public ngOnInit(): void {
    this._notifySubscription =
      this._errorNotificationService.notified$.subscribe(error => {
        if (error) {
          this.error = error;
          this._displayNotification();
        }
      });
  }

  private _displayNotification(): void {
    if (!this._isOpened) {
      this._isOpened = true;
      this.httpResponseErrorMessage =
        this.error instanceof HttpErrorResponse
          ? `Статус-код: ${this.error.status} - ${this.error.statusText}`
          : '';
      this.elClassList = ['error-notification', 'error-notification--active'];
      setTimeout(() => this.hideNotification(), 5000);
    }
  }

  protected hideNotification(): void {
    if (this._isOpened) {
      this._isOpened = false;
      this.elClassList = ['error-notification'];
      setTimeout(
        () => (this.elClassList = ['error-notification', 'display-none']),
        500
      );
    }
  }

  public ngOnDestroy() {
    this._notifySubscription.unsubscribe();
  }
}
