import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GitlabService } from '../../../statistics/gitlab.service';
import { GitlabAuthService } from '../gitlab-auth.service';
import { UserExtraDto } from '../../../statistics/dto/userExtra.dto';

@Component({
  selector: 'app-login-preview',
  templateUrl: './login-preview.component.html',
  styleUrls: ['./login-preview.component.css'],
})
export class LoginPreviewComponent implements OnChanges {
  protected isLoadingNow = true;
  @Input() public isLoggedIn = false;
  protected userData:
    | Pick<UserExtraDto, 'name' | 'username' | 'email' | 'avatar_url'>
    | undefined;
  constructor(
    protected gitlabAuthService: GitlabAuthService,
    protected gitlabService: GitlabService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.isLoadingNow = true;
    if (this.gitlabAuthService.hasValidAccessToken()) {
      this.isLoggedIn = true;
      this.gitlabService.getProfileData().subscribe(data => {
        this.userData = data;
        this.isLoadingNow = false;
      });
    } else {
      this.isLoadingNow = false;
    }
  }
}
