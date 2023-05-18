import { Injectable } from '@angular/core';
import { GitlabService } from '../../statistics/gitlab.service';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  map,
  Observable,
  reduce,
  switchAll,
  take,
} from 'rxjs';
import { UserDto } from '../../statistics/dto/user.dto';
import { IUserStat } from './compare-list/compare-list.component';
import { StatisticsService } from '../../statistics/statistics.service';

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
  searchUsers$: Observable<UserDto[]> = this.searchUsers.asObservable();

  isLoadingSearch$ = new BehaviorSubject<boolean>(false);
  isLoadingUserStats$ = new BehaviorSubject<boolean>(false);

  constructor(
    private gitlabService: GitlabService,
    private statisticService: StatisticsService
  ) {}

  findSearchUsers(data: { search: string }) {
    this.searchUsers.next([]);
    this.gitlabService
      .getUsers(data)
      .pipe(
        switchAll(),
        take(5),
        reduce((acc: UserDto[], value) => [...acc, value], [])
      )
      .subscribe(users => this.searchUsers.next(users));
  }

  addUserToCompare(user: UserDto) {
    this.isLoadingUserStats$.next(true);
    forkJoin([
      this.statisticService.getCommitsCount(user.id),
      this.statisticService.getMostActiveWeekDay(user.id),
      this.statisticService.getEditingStats(user.id),
    ])
      .pipe(
        map(([commitsCount, mostActiveWeekday, editStats]) => {
          return {
            id: user.id,
            username: user.username,
            avatar_url: user.avatar_url,
            mostActiveWeekday,
            commitsCount,
            editStats,
          };
        }),
        catchError(err => {
          this.isLoadingUserStats$.next(false);
          throw 'bad';
        })
      )
      .subscribe(stats => {
        this.userStats.next([...this.userStats.value, stats]);
        this.isLoadingUserStats$.next(false);
      });
  }
}
