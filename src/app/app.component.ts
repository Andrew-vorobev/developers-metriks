import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './authCodeFlowConfig';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  protected isLogged: boolean;
  constructor(private OAuthService: OAuthService) {}

  ngOnInit(): void {
    this.OAuthService.configure(authCodeFlowConfig);
    this.OAuthService.loadDiscoveryDocumentAndTryLogin().then(e =>
      console.log(e)
    );
    this.isLogged = this.OAuthService.hasValidAccessToken();
  }

  onLogin() {
    this.isLogged = true;
    this.OAuthService.setupAutomaticSilentRefresh();
    this.OAuthService.initCodeFlow();
  }

  onLogOut() {
    this.OAuthService.logOut();
    this.OAuthService.revokeTokenAndLogout().then(el => console.log(el));
    this.isLogged = false;
  }

  onCheck() {
    console.log(this.OAuthService.hasValidAccessToken());
  }
}
