import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDto } from './dto/user.dto';
import {
  catchError,
  combineAll,
  combineLatest,
  concatAll,
  map,
  mergeAll,
  mergeMap,
  Observable,
  reduce,
  tap,
} from 'rxjs';
import { UserExtraDto } from './dto/userExtra.dto';
import { OAuthService } from 'angular-oauth2-oidc';
import { ProjectDto } from './dto/project.dto';
import { CommitDto } from './dto/commit.dto';
import { ProfileDto } from './dto/profile.dto';
import { PushedEventDto } from './dto/pushed-event.dto';
import { CommitExtraDto } from './dto/commit-extra.dto';

interface IEventParams {
  authorId?: string;
  action?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GitlabService {
  constructor(private httpClient: HttpClient) {}

  getEvents(params?: IEventParams) {
    return this.httpClient.get<PushedEventDto[]>(
      `https://gitlab.com/api/v4/${
        params?.authorId ? `users/${params.authorId}/events` : 'events'
      }`,
      {
        params: {
          ...params,
        },
      }
    );
  }

  getUsers(options?: {
    id?: number;
    username?: string;
  }): Observable<UserDto[]> {
    return this.httpClient.get<UserDto[]>('https://gitlab.com/api/v4/users', {
      params: options,
    });
  }

  getUser(userID: number): Observable<UserExtraDto> {
    return this.httpClient.get<UserExtraDto>(
      `https://gitlab.com/api/v4/users/${userID}`
    );
  }

  getProfileData(): Observable<ProfileDto> {
    return this.httpClient.get<ProfileDto>(`https://gitlab.com/api/v4/user`);
  }

  getCommits(
    repoId: number,
    params?: {
      author?: string;
      order?: 'default' | 'topo';
      all?: boolean;
    }
  ): Observable<CommitDto[]> {
    return this.httpClient
      .get<CommitDto[]>(
        `https://gitlab.com/api/v4/projects/${repoId}/repository/commits`,
        {
          params: params,
        }
      )
      .pipe(catchError(() => []));
  }

  getCommitsExtended(
    repoId: number,
    params?: {
      author?: string;
      order?: 'default' | 'topo';
      all?: boolean;
    }
  ) {
    return this.httpClient
      .get<CommitDto[]>(
        `https://gitlab.com/api/v4/projects/${repoId}/repository/commits`,
        {
          params: params,
        }
      )
      .pipe(
        mergeAll(),
        mergeMap(({ id }) => {
          return this.httpClient.get<CommitExtraDto>(
            `https://gitlab.com/api/v4/projects/${repoId}/repository/commits/${id}`
          );
        }),
        reduce((arr: CommitExtraDto[], commit) => [commit, ...arr], [])
      );
  }

  public getProjects(params?: {
    membership?: boolean;
    authorId?: string;
    owned?: boolean;
    visibility?: 'public' | 'internal' | 'private';
    order_by?:
      | 'id'
      | 'name'
      | 'path'
      | 'created_at'
      | 'updated_at'
      | 'last_activity_at'
      | 'similarity';
  }): Observable<ProjectDto[]> {
    return this.httpClient.get<ProjectDto[]>(
      `https://gitlab.com/api/v4/${
        params?.authorId ? `users/${params.authorId}/projects` : 'projects'
      }`,
      {
        params: params,
      }
    );
  }
}
