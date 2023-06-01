import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  firstValueFrom,
  forkJoin,
  map,
  mergeAll,
  mergeMap,
  Observable,
  of,
  Subject,
  Subscription,
  tap,
} from 'rxjs';
import { GitlabService } from '../../statistics/gitlab.service';
import { StatisticsService } from '../../statistics/statistics.service';
import { IUserStat } from '../../shared/interfaces/user-stat.interface';
import { UserExtraDto } from '../../statistics/dto/userExtra.dto';
import { CommitExtraDto } from '../../statistics/dto/commit-extra.dto';
import { ProjectDto } from '../../statistics/dto/project.dto';
import { GitlabAuthService } from '../auth/gitlab-auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public userDataLoaded: Subject<void> = new Subject<void>();
  public userDataLoaded$: Observable<void> = this.userDataLoaded.asObservable();

  public userData: UserExtraDto;
  public userStats: IUserStat;

  public projects: ProjectDto[];
  public commits: CommitExtraDto[];

  public isUserExist = true;
  public isLoadingUserData = true;
  public isLoadingUserStats = true;
  public isLoadingUserActivity = true;
  private _subs: Subscription[];

  constructor(
    private _gitlabAuthService: GitlabAuthService,
    private _gitlabService: GitlabService,
    private _statisticService: StatisticsService
  ) {}

  private _subscribeOnUserData(): void {
    this._subs?.forEach(sub => sub.unsubscribe());
    this._subs = [
      this.userDataLoaded$.subscribe(() => this._setUserStats()),
      this.userDataLoaded$.subscribe(() => this._setUserActivity()),
    ];
  }

  public updateUserData(userNameId: string): void {
    if (!this._gitlabAuthService.hasValidAccessToken()) return;
    this._subscribeOnUserData();
    this.isLoadingUserData = true;

    if (userNameId.match(/^\d+$/)) {
      this._setUserData(this._gitlabService.getUser(parseInt(userNameId)));
    } else {
      this._setUserData(
        this._gitlabService.getUsers({ search: userNameId }).pipe(
          map(users => {
            if (users.length === 0) {
              this.isUserExist = false;
              throw new Error('Пользователь не найдён');
            }
            return users[0].id;
          }),
          concatMap(id => this._gitlabService.getUser(id))
        )
      );
    }
  }

  private _setUserData(data$: Observable<UserExtraDto>): void {
    firstValueFrom(data$)
      .then(data => {
        this.userData = data;
        this.userDataLoaded.next();
      })
      .catch(() => {
        this.isUserExist = false;
        throw new Error('Пользователь не найдён');
      })
      .finally(() => {
        this.isLoadingUserData = false;
      });
  }

  private _setUserStats(): void {
    this.isLoadingUserStats = true;
    firstValueFrom(
      forkJoin([
        this._statisticService.getProgramingLanguages(this.userData.id),
        this._statisticService.getMostActiveWeekDay(this.userData.id),
        this._statisticService.getCommitsCount(this.userData.id),
        this._statisticService.getEditingStats(this.userData.id),
      ]).pipe(
        map(([languages, mostActiveWeekday, commitsCount, editStats]) => {
          return {
            programingLanguages: languages,
            mostActiveWeekday: mostActiveWeekday,
            commitsCount: commitsCount,
            editStats: editStats,
            reviewsCount: 3,
          } as IUserStat;
        })
      )
    )
      .then(stats => {
        this.userStats = stats;
        this.isLoadingUserStats = false;
      })
      .catch(() => {
        throw new Error('Не удалось получить статистику пользователя');
      });
  }

  private _setUserActivity(): void {
    this.isLoadingUserActivity = true;

    firstValueFrom(
      this._gitlabService
        .getProjects({ authorId: this.userData.id })
        .pipe(
          tap(projects => {
            this.projects = projects;
          })
        )
        .pipe(
          mergeAll(),
          mergeMap(project => {
            return this._gitlabService.getCommitsExtended(project.id);
          })
        )
    )
      .then(commits => {
        this.commits = commits;
        this.isLoadingUserActivity = false;
      })
      .catch(() => {
        throw new Error(
          'Не удалось получить данные о репозитериях и коммитах пользователя'
        );
      });
  }
}
