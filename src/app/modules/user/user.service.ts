import { Injectable } from '@angular/core';
import {
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
  take,
  takeUntil,
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
  private _projectsReady = new Subject<void>();
  private _projectsReady$ = this._projectsReady.asObservable();
  public visibleProjectsCount = 4;
  public visibleCommitsCount = 8;

  public isUserExist = true;
  public isLoadingUserData = true;
  public isLoadingUserStats = true;
  public isLoadingUserProjects = true;
  public isLoadingUserCommits = true;
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
      this.userDataLoaded$.subscribe(() => this._setUserProjects()),
      this._projectsReady$.subscribe(() => this._setUserCommits()),
    ];
  }

  public updateUserData(isProfile: boolean, userNameId?: string): void {
    if (!this._gitlabAuthService.hasValidAccessToken()) return;

    this._subscribeOnUserData();
    this.isUserExist = true;
    this.isLoadingUserData = true;
    this.isLoadingUserStats = true;
    this.isLoadingUserProjects = true;
    this.isLoadingUserCommits = true;
    this.projects = [];
    this.commits = [];

    if (isProfile) {
      this._getProfileData();
    } else {
      this._getUserData(userNameId as string);
    }
  }

  private _getProfileData(): void {
    this._setUserData(
      this._gitlabService.getProfileData() as Observable<UserExtraDto>
    );
  }

  private _getUserData(userNameId: string): void {
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
        this._statisticService.getReviewsCount(this.userData.id),
      ]).pipe(
        map(
          ([
            languages,
            mostActiveWeekday,
            commitsCount,
            editStats,
            reviewsCount,
          ]) => {
            return {
              programingLanguages: languages,
              mostActiveWeekday: mostActiveWeekday,
              commitsCount: commitsCount,
              editStats: editStats,
              reviewsCount: reviewsCount,
            } as IUserStat;
          }
        )
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

  private _setUserProjects(): void {
    firstValueFrom(
      this._gitlabService.getProjects({
        authorId: this.userData.id,
        membership: true,
      })
    )
      .then(projects => {
        this.projects = projects;
        this.isLoadingUserProjects = false;
        this._projectsReady.next();
      })
      .catch(() => {
        throw new Error(
          'Не удалось получить данные о репозитериях пользователя'
        );
      });
  }

  private _setUserCommits(): void {
    if (this.projects.length === 0) {
      this.commits = [];
      this.isLoadingUserCommits = false;
      return;
    }

    firstValueFrom(
      of(this.projects).pipe(
        mergeAll(),
        mergeMap(project => this._gitlabService.getCommitsExtended(project.id)),
        take(this.visibleCommitsCount)
      )
    )
      .then(commits => {
        commits.sort((a, b) => {
          return (
            new Date(b.committed_date).getTime() -
            new Date(a.committed_date).getTime()
          );
        });
        this.commits = commits;
        this.isLoadingUserCommits = false;
      })
      .catch(() => {
        throw new Error('Не удалось получить данные о коммитах пользователя');
      });
  }
}
