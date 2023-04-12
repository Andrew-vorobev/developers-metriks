import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent {
  constructor(private OAuthService: OAuthService) {}
  onLogin() {
    console.log(this.OAuthService.getIdentityClaims());
  }
}
