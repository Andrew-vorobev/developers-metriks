import { Injectable } from '@angular/core';
import { GitlabService } from './gitlab.service';
import { map, mergeAll, mergeMap, Observable, reduce, tap } from 'rxjs';

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
        (stats: { [key: string]: number }, day) => {
          return { [day]: stats[day]++, ...stats };
        },
        { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
      ),
      map(obj => Math.max(...(Object.values(obj) as number[]))),
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
    return this.gitlabService.getProjects({ authorId: authorId }).pipe(
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
}
