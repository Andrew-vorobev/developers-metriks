import { Component } from '@angular/core';
import { GitlabAuthService } from '../gitlab-auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent {
  constructor(protected gitlabAuthService: GitlabAuthService) {}

  onLogin() {
    this.gitlabAuthService.login();
  }

  onLogout() {
    this.gitlabAuthService.logout();
  }
}
