import { Injectable } from '@angular/core';
import {
  concatMap,
  firstValueFrom,
  forkJoin,
  from,
  map,
  mergeAll,
  mergeMap,
  Observable,
  of,
  Subject,
  Subscription,
  take,
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

  private _projectsReady = new Subject<void>();
  private _projectsReady$ = this._projectsReady.asObservable();
  public projects: ProjectDto[];
  public commits: CommitExtraDto[];
  public visibleProjectsCount = 4;
  public visibleCommitsCount = 8;
  public projectNameById: { [key: number]: string };

  public isUserExist = true;
  public isLoadingUserData = true;
  public isLoadingUserStats = true;
  public isLoadingUserProjects = true;
  public isLoadingUserProjectsLanguages = true;
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
      this.userDataLoaded$.subscribe(() => this._updateUserStats()),
      this.userDataLoaded$.subscribe(() => this._updateUserProjects()),
      this._projectsReady$.subscribe(() => this._updateUserProjectsLanguages()),
      this._projectsReady$.subscribe(() => this._updateUserCommits()),
    ];
  }

  public updateUserData(isProfile: boolean, userNameId?: string): void {
    if (!this._gitlabAuthService.hasValidAccessToken()) return;

    this._subscribeOnUserData();
    this.isUserExist = true;
    this.isLoadingUserData = true;
    this.isLoadingUserStats = true;
    this.isLoadingUserProjects = true;
    this.isLoadingUserProjectsLanguages = true;
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

  private _updateUserStats(): void {
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

  private _updateUserProjects(): void {
    firstValueFrom(
      this._gitlabService.getProjects({
        authorId: this.userData.id,
        membership: true,
      })
    )
      .then(projects => {
        this.projectNameById = {};
        projects.forEach(
          project => (this.projectNameById[project.id] = project.name as string)
        );
        this.projects = projects;

        this._projectsReady.next();
        this.isLoadingUserProjects = false;
      })
      .catch(() => {
        throw new Error(
          'Не удалось получить данные о репозитериях пользователя'
        );
      });
  }

  private _updateUserProjectsLanguages(): void {
    if (this.projects.length === 0) {
      this.commits = [];
      this.isLoadingUserProjectsLanguages = false;
      return;
    }

    let i = 0;
    this._subs.push(
      from(this.projects)
        .pipe(
          concatMap(project =>
            this._gitlabService.getProgramingLanguages(project.id)
          )
        )
        .subscribe({
          next: languages => {
            this.projects[i++].languages = this._concatLanguagesPercent(
              Object.entries(languages)
            );
            this.isLoadingUserProjectsLanguages = false;
          },
          error: () => {
            throw new Error(
              'Не удалось получить данные о языках программирования проектов пользователя'
            );
          },
        })
    );
  }

  private _concatLanguagesPercent(languages: [string, number][]): string[] {
    const result = [];
    for (const [language, percent] of languages) {
      result.push(`${language} (${Math.floor(percent)}%)`);
    }
    return result;
  }

  private _updateUserCommits(): void {
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
        this._sortCommitsByDate(commits);
        commits.forEach(
          commit =>
            (commit.project_name = this.projectNameById[commit.project_id])
        );
        this.commits = commits;
        this.isLoadingUserCommits = false;
      })
      .catch(() => {
        throw new Error('Не удалось получить данные о коммитах пользователя');
      });
  }

  private _sortCommitsByDate(commits: CommitExtraDto[]): void {
    commits.sort((a, b) => {
      return (
        new Date(b.committed_date).getTime() -
        new Date(a.committed_date).getTime()
      );
    });
  }
}
