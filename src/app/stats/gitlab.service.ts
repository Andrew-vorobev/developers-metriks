import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDto } from './dto/user.dto';
import { Observable } from 'rxjs';
import { UserExtraDto } from './dto/userExtra.dto';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root',
})
export class GitlabService {
  constructor(
    private httpClient: HttpClient,
    private OAuthService: OAuthService
  ) {}

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
      `https://gitlab.com/api/v4/users/${userID}`,
      {}
    );
  }

  getProfileData(): Observable<UserExtraDto> {
    return this.httpClient.get<UserExtraDto>(
      `https://gitlab.com/api/v4/user`,
      {}
    );
  }

  getData<T>(): Observable<T> {
    return this.httpClient.get<T>('');
  }

  getCommits(
    repoId: number,
    params?: {
      author?: string;
      order?: 'default' | 'topo';
      all?: boolean;
    }
  ): Observable<never> {
    return this.httpClient.get<never>(
      `https://gitlab.com/api/v4/projects/${repoId}/repository/commits`,
      {
        params: params,
      }
    );
  }

  getProjects(params?: {
    membership?: boolean;
    owned?: boolean;
    order_by?:
      | 'id'
      | 'name'
      | 'path'
      | 'created_at'
      | 'updated_at'
      | 'last_activity_at'
      | 'similarity';
  }): Observable<never> {
    return this.httpClient.get<never>(`https://gitlab.com/api/v4/projects`, {
      params: params,
    });
  }
}
