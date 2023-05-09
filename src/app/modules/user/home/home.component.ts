import { Component, OnInit } from '@angular/core';
import { GitlabService } from '../../../statistics/gitlab.service';
import { StatisticsService } from '../../../statistics/statistics.service';
import { GitlabAuthService } from '../../auth/gitlab-auth.service';
import { ProfileDto } from '../../../statistics/dto/profile.dto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  protected data: ProfileDto;
  protected isLoading = false;
  protected isLogged = false;
  protected commitCount: number;
  constructor(
    private gitlabService: GitlabService,
    private gitlabAuthService: GitlabAuthService,
    private statisticService: StatisticsService
  ) {}

  ngOnInit() {
    if (this.gitlabAuthService.hasValidAccessToken()) {
      this.isLoading = true;
      this.isLogged = true;
      this.gitlabService.getProfileData().subscribe(data => {
        this.data = data;
      });
      this.statisticService.getCommitsCount().subscribe(commits => {
        this.commitCount = commits;
        this.isLoading = false;
      });
      this.statisticService.getMostActiveWeekDay();
      this.statisticService.getEditingStats();
    }
  }
}
