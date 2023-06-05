import { Injectable } from '@angular/core';
import { GitlabService } from '../../statistics/gitlab.service';
import {
  BehaviorSubject,
  catchError,
  filter,
  forkJoin,
  map,
  Observable,
  reduce,
  switchAll,
  take,
} from 'rxjs';
import { UserDto } from '../../statistics/dto/user.dto';
import { StatisticsService } from '../../statistics/statistics.service';
import { IUserStat } from '../../shared/interfaces/user-stat.interface';

@Injectable({
  providedIn: 'root',
})
export class CompareService {
  private userStats: BehaviorSubject<IUserStat[]> = new BehaviorSubject<
    IUserStat[]
  >([]);
  userStats$: Observable<IUserStat[]> = this.userStats.asObservable();
  private searchUsers: BehaviorSubject<UserDto[]> = new BehaviorSubject<
    UserDto[]
  >([]);
  public searchUsers$: Observable<UserDto[]> = this.searchUsers.asObservable();
  private _isLoadingSearch = new BehaviorSubject<boolean>(false);
  private _isLoadingUserStats = new BehaviorSubject<boolean>(false);
  public isLoadingSearch$ = this._isLoadingSearch.asObservable();
  public isLoadingUserStats$ = this._isLoadingUserStats.asObservable();

  constructor(
    private gitlabService: GitlabService,
    private statisticService: StatisticsService
  ) {}

  findSearchUsers(data: { search: string }) {
    this._isLoadingSearch.next(true);
    this.searchUsers.next([]);
    this.gitlabService
      .getUsers(data)
      .pipe(
        switchAll(),
        take(20),
        filter(user => !this.userStats.value.some(ur => ur.id === user.id)),
        take(5),
        reduce((acc: UserDto[], value) => [...acc, value], [])
      )
      .subscribe(users => {
        this.searchUsers.next(users);
        this._isLoadingSearch.next(false);
      });
  }

  addUserToCompare(user: UserDto) {
    this.searchUsers.next([]);
    this._isLoadingUserStats.next(true);
    forkJoin([
      this.statisticService.getCommitsCount(user.id),
      this.statisticService.getMostActiveWeekDay(user.id),
      this.statisticService.getEditingStats(user.id),
      this.statisticService.getReviewsCount(user.id),
    ])
      .pipe(
        map(([commitsCount, mostActiveWeekday, editStats, reviewsCount]) => {
          return {
            id: user.id,
            username: user.username,
            avatar_url: user.avatar_url,
            mostActiveWeekday,
            commitsCount,
            editStats,
            reviewsCount,
          };
        }),
        catchError(err => {
          this._isLoadingUserStats.next(false);
          throw 'bad';
        })
      )
      .subscribe(stats => {
        this.userStats.next([...this.userStats.value, stats]);
        this._isLoadingUserStats.next(false);
      });
  }

  deleteUser(userId: number) {
    console.log(this.userStats.value.filter(data => data.id === userId));
    this.userStats.next(
      this.userStats.value.filter(data => data.id !== userId)
    );
  }
}
