import { Injectable } from '@angular/core';
import { GitlabService } from './gitlab.service';
import { map, mergeAll, mergeMap, Observable, of, reduce, tap } from 'rxjs';
import { ProjectDto } from './dto/project.dto';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private gitlabService: GitlabService) {}

  public getCommitsCount(authorId?: number) {
    return this.gitlabService.getEvents({ action: 'pushed', authorId }).pipe(
      tap(co => console.log(co)),
      mergeAll(),
      map(data => data.push_data.commit_count),
      reduce((prev, curr) => prev + curr, 0)
    );
  }

  public getMostActiveWeekDay(authorId?: number) {
    return this.gitlabService.getEvents({ authorId }).pipe(
      tap(ev => console.log(ev)),
      mergeAll(),
      map(event => new Date(event.created_at).getUTCDay()),
      reduce(
        (stats: { [key: number]: number }, day) => {
          return { [day]: stats[day]++, ...stats };
        },
        { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
      ),
      map(obj => {
        let result = ['0', -1];
        Object.entries(obj).forEach(([weekday, eventsCount]) => {
          if (eventsCount > result[1]) result = [weekday, eventsCount];
        });
        return parseInt(result[0] as string);
      }),
      tap(st => console.log(st))
    );
  }

  public getEditingStats(authorId?: number) {
    return this.gitlabService
      .getProjects({ authorId, membership: !authorId })
      .pipe(
        mergeAll(),
        mergeMap(project => {
          return this.gitlabService.getCommitsExtended(project.id);
        }),
        mergeAll(),
        reduce(
          (data: number[], commit) => {
            const stats = commit.stats;
            return [data[0] + stats.additions, data[1] + stats.deletions];
          },
          [0, 0]
        )
      );
  }

  public getProgramingLanguages(authorId: number): Observable<Set<string>> {
    return this.gitlabService
      .getProjects({ authorId, membership: !authorId })
      .pipe(
        mergeAll(),
        mergeMap(project => {
          return this.gitlabService.getProgramingLanguages(project.id);
        }),
        reduce((data: Set<string>, languages: any) => {
          Object.keys(languages).forEach(language => data.add(language));
          return data;
        }, new Set<string>())
      );
  }

  public getReviewsCount(userId: number): Observable<number> {
    return this.gitlabService
      .getProjects({ authorId: userId, membership: !userId })
      .pipe(
        mergeAll(),
        mergeMap(project => {
          return this.gitlabService.getMergeRequests(project.id);
        }),
        mergeAll(),
        mergeMap(request => {
          return this.gitlabService.getRequestReviewers(
            request.project_id,
            request.iid
          );
        }),
        mergeAll(),
        reduce((reviewsCount, review) => {
          if (review.user.id === userId) {
            return reviewsCount + (review.state === 'reviewed' ? 1 : 0);
          }
          return reviewsCount;
        }, 0)
      );
  }
}
