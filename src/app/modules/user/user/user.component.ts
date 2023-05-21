import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileDto } from '../../../statistics/dto/profile.dto';
import { GitlabService } from '../../../statistics/gitlab.service';
import { GitlabAuthService } from '../../auth/gitlab-auth.service';
import { StatisticsService } from '../../../statistics/statistics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  protected isLoading = false;
  protected isLogged = false;
  protected commitCount: number;
  protected data: ProfileDto;
  private _subs: Subscription[];

  constructor(
    private _gitlabService: GitlabService,
    private _gitlabAuthService: GitlabAuthService,
    private _statisticService: StatisticsService
  ) {
    this._subs = [];
  }

  ngOnInit() {
    if (this._gitlabAuthService.hasValidAccessToken()) {
      this.isLoading = this.isLogged = true;
      this._subs.push(
        this._gitlabService.getProfileData().subscribe(data => {
          this.data = data;
        })
      );
      this._subs.push(
        this._statisticService.getCommitsCount().subscribe(commits => {
          this.commitCount = commits;
          this.isLoading = false;
        })
      );
      this._statisticService.getMostActiveWeekDay();
      this._statisticService.getEditingStats();
    }
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }
}
