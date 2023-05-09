import { Injectable } from '@angular/core';
import { GitlabService } from './gitlab.service';
import { map, mergeAll, mergeMap, reduce, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private gitlabService: GitlabService) {}

  public getCommitsCount() {
    return this.gitlabService.getEvents({ action: 'pushed' }).pipe(
      tap(co => console.log(co)),
      mergeAll(),
      map(data => data.push_data.commit_count),
      reduce((prev, curr) => prev + curr, 0)
    );
  }

  public getMostActiveWeekDay() {
    return this.gitlabService.getEvents().pipe(
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

  public getEditingStats() {
    return this.gitlabService.getProjects({ membership: true }).pipe(
      mergeAll(),
      mergeMap(project => {
        return this.gitlabService.getCommitsExtended(project.id);
      }),
      tap(e => console.log(e))
    );
  }
}
