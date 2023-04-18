import { Component, OnInit } from '@angular/core';
import { GitlabAuthService } from './gitlab-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  protected isLogged: boolean;
  constructor(private gitlabAuthService: GitlabAuthService) {}

  ngOnInit() {
    this.gitlabAuthService.isLogged.subscribe(value => {
      this.isLogged = value;
    });
  }

  onLogin() {
    this.gitlabAuthService.login();
  }

  onLogOut() {
    this.gitlabAuthService.logout();
  }

  onCheck() {
    console.log(this.gitlabAuthService.isLogged);
  }
}
