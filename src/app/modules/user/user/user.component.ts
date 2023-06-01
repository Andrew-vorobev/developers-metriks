import { Component, OnDestroy, OnInit } from '@angular/core';
import { GitlabService } from '../../../statistics/gitlab.service';
import { GitlabAuthService } from '../../auth/gitlab-auth.service';
import { StatisticsService } from '../../../statistics/statistics.service';
import { map, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  private _subs: Subscription[];

  constructor(
    private _gitlabService: GitlabService,
    private _gitlabAuthService: GitlabAuthService,
    private _statisticService: StatisticsService,
    private _activateRoute: ActivatedRoute,
    protected _userService: UserService
  ) {
    this._subs = [];
  }

  ngOnInit() {
    this._subs.push(
      this._activateRoute.params
        .pipe(map(params => params['id']))
        .subscribe(userNameId => this._userService.updateUserData(userNameId))
    );
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }
}

// export class UserComponent implements OnInit, OnDestroy {
//   protected isLoading = false;
//   protected isLogged = false;
//   protected isUserExist = true;
//   protected userData: UserExtraDto;
//   protected commits: CommitExtraDto[];
//   protected projects: ProjectDto[];
//   protected languages$: Observable<Set<string>>;
//   protected mostActiveDay: string;
//   protected commitsCount: number;
//   protected editingStats: number[];
//   protected reviewsCount: number;
//   private _subs: Subscription[];
//
//   constructor(
//     private _gitlabService: GitlabService,
//     private _gitlabAuthService: GitlabAuthService,
//     private _statisticService: StatisticsService,
//     private _activateRoute: ActivatedRoute
//   ) {
//     this._subs = [];
//   }
//
//   ngOnInit() {
//     this._subs.push(
//       this._activateRoute.params
//         .pipe(map(params => params['id']))
//         .subscribe(userNameId => this._updateData(userNameId))
//     );
//   }
//
//   ngOnDestroy() {
//     this._subs.forEach(sub => sub.unsubscribe());
//   }
//
//   private _updateData(userNameId: string): void {
//     if (!this._gitlabAuthService.hasValidAccessToken()) return;
//     this.isLogged = true;
//     this.isLoading = true;
//
//     if (userNameId.match(/^\d+$/)) {
//       this._updateGeneralData(
//         this._gitlabService.getUser(parseInt(userNameId))
//       );
//     } else {
//       this._updateGeneralData(
//         this._gitlabService.getUsers({ search: userNameId }).pipe(
//           map(users => {
//             if (users.length === 0) {
//               this.isUserExist = false;
//               throw new Error('Пользователь не найдён');
//             }
//             return users[0].id;
//           }),
//           concatMap(id => this._gitlabService.getUser(id))
//         )
//       );
//     }
//
//     firstValueFrom(
//       this._gitlabService.getProjects({ authorId: this.userData.id })
//     ).then(projects => {
//       this.projects = projects;
//     });
//
//     // firstValueFrom(this._gitlabService.getProgramingLanguages());
//
//     firstValueFrom(this._statisticService.getCommitsCount()).then(commits => {
//       this.commitsCount = commits;
//       this.isLoading = false;
//     });
//     this._statisticService.getMostActiveWeekDay();
//     this._statisticService.getEditingStats();
//   }
//
//   private _updateGeneralData(userData$: Observable<UserExtraDto>): void {
//     firstValueFrom(userData$)
//       .then(data => {
//         this.userData = data;
//       })
//       .catch(error => {
//         this.isUserExist = false;
//         throw new Error('Пользователь не найдён');
//       });
//   }
// }
