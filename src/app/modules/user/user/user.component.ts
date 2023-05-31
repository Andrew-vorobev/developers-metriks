import { Component, OnDestroy, OnInit } from '@angular/core';
import { GitlabService } from '../../../statistics/gitlab.service';
import { GitlabAuthService } from '../../auth/gitlab-auth.service';
import { StatisticsService } from '../../../statistics/statistics.service';
import {
  concatMap,
  firstValueFrom,
  map,
  Observable,
  of,
  Subscription,
  tap,
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserExtraDto } from '../../../statistics/dto/userExtra.dto';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  protected isLoading = false;
  protected isLogged = false;
  protected isUserExist = true;
  protected commitCount: number;
  protected data: UserExtraDto;
  protected userId: number;
  private _subs: Subscription[];

  constructor(
    private _gitlabService: GitlabService,
    private _gitlabAuthService: GitlabAuthService,
    private _statisticService: StatisticsService,
    private _activateRoute: ActivatedRoute
  ) {
    this._subs = [];
  }

  ngOnInit() {
    this._subs.push(
      this._activateRoute.params
        .pipe(map(params => params['id']))
        .subscribe(userNameId => this._updateData(userNameId))
    );
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  private _updateData(userNameId: string): void {
    if (!this._gitlabAuthService.hasValidAccessToken()) return;
    this.isLogged = true;
    this.isLoading = true;

    if (userNameId.match(/^\d+$/)) {
      this.userId = parseInt(userNameId);
      this._updateGeneralData(this._gitlabService.getUser(this.userId));
    } else {
      this._updateGeneralData(
        this._gitlabService.getUsers({ search: userNameId }).pipe(
          map(users => {
            if (users.length === 0) {
              this.isUserExist = false;
              throw new Error('Пользователь не найдён');
            }
            this.userId = users[0].id;
            return this.userId;
          }),
          concatMap(id => this._gitlabService.getUser(id))
        )
      );
    }

    firstValueFrom(this._statisticService.getCommitsCount()).then(commits => {
      this.commitCount = commits;
      this.isLoading = false;
    });
    this._statisticService.getMostActiveWeekDay();
    this._statisticService.getEditingStats();
  }

  private _updateGeneralData(userData$: Observable<UserExtraDto>): void {
    firstValueFrom(userData$)
      .then(data => {
        // console.log(data);
        this.data = data;
      })
      .catch(error => {
        this.isUserExist = false;
        throw new Error('Пользователь не найдён');
      });
  }
}

// if (this.userNameId.match(/^\d+$/)) {
//   this.userId = parseInt(this.userNameId);
// } else {
//   this._subs.push(
//     this._gitlabService
//       .getUsers({ search: this.userNameId })
//       .subscribe(users => {
//         if (users.length === 0) {
//           this.isUserExist = false;
//           return;
//         }
//         this.userId = users[0].id;
//       })
//   );
// }
//
// this._subs.push(
//   this._gitlabService.getUser(this.userId).subscribe(data => {
//     if (data.message === '404 User Not Found') {
//       this.isUserExist = false;
//       return;
//     }
//     this.data = data;
//   })
// );
