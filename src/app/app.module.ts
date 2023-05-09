import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { GitlabService } from './statistics/gitlab.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { GlobalErrorHandlerService } from './errors/error-handler/global-error-handler.service';
import { ErrorConsoleLoggerService } from './errors/error-handler/error-console-logger/error-console-logger.service';
import { ErrorNotificationService } from './errors/error-handler/error-notification/error-noification.service';
import { ErrorNotificationComponent } from './errors/error-handler/error-notification/error-notification.component';
import { HttpInterceptorService } from './errors/http-interceptor/http-Interceptor.service';
import { ERROR_LOGGER } from './errors/error-handler/error-logger.interface';

@NgModule({
  declarations: [AppComponent, NotfoundComponent, ErrorNotificationComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['https://gitlab.com/api'],
        sendAccessToken: true,
      },
    }),
  ],
  providers: [
    GitlabService,
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    { provide: ERROR_LOGGER, useExisting: ErrorNotificationService }, // ErrorConsoleLoggerService
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
