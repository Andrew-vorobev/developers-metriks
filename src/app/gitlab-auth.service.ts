import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './authCodeFlowConfig';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GitlabAuthService {
  public isLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  constructor(private oAuthService: OAuthService) {
    oAuthService.configure(authCodeFlowConfig);
    oAuthService.loadDiscoveryDocumentAndTryLogin().then();
    this.isLogged.next(oAuthService.hasValidAccessToken());
  }

  login() {
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.initCodeFlow();
    this.isLogged.next(this.oAuthService.hasValidAccessToken());
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout().then(() => {
      this.isLogged.next(this.oAuthService.hasValidAccessToken());
    });
  }
}
