import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from '../../authCodeFlowConfig';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GitlabAuthService {
  private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(private oAuthService: OAuthService) {
    oAuthService.configure(authCodeFlowConfig);
    oAuthService.loadDiscoveryDocumentAndTryLogin().then();
    this._isLoggedIn.next(oAuthService.hasValidAccessToken());
  }

  public login() {
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.initCodeFlow();
    this._isLoggedIn.next(this.oAuthService.hasValidAccessToken());
  }

  public logout() {
    this.oAuthService.revokeTokenAndLogout().then(() => {
      this._isLoggedIn.next(this.oAuthService.hasValidAccessToken());
    });
  }

  public hasValidAccessToken() {
    return this.oAuthService.hasValidAccessToken();
  }
}
