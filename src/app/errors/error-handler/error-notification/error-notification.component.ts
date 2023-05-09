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
  private notifySubscription: Subscription;
  protected elClassList: string[] = ['error-notification'];
  private isOpened = false;

  constructor(private errorNotificationService: ErrorNotificationService) {}

  ngOnInit(): void {
    this.notifySubscription = this.errorNotificationService.notified$.subscribe(
      error => {
        if (error) {
          this.error = error;
          this.displayNotification();
        }
      }
    );
  }

  displayNotification(): void {
    if (!this.isOpened) {
      this.isOpened = true;
      this.httpResponseErrorMessage =
        this.error instanceof HttpErrorResponse
          ? `Статус-код: ${this.error.status} - ${this.error.statusText}`
          : '';
      this.elClassList = ['error-notification', 'error-notification--active'];
      setTimeout(() => this.hideNotification(), 5000);
    }
  }

  hideNotification(): void {
    if (this.isOpened) {
      this.isOpened = false;
      this.elClassList = ['error-notification'];
      setTimeout(
        () => (this.elClassList = ['error-notification', 'display-none']),
        500
      );
    }
  }

  ngOnDestroy() {
    this.notifySubscription.unsubscribe();
  }
}
