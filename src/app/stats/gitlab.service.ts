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
      headers: {
        Authorization: 'Bearer ' + this.OAuthService.getAccessToken(),
      },
    });
  }

  getUser(userID: number): Observable<UserExtraDto> {
    return this.httpClient.get<UserExtraDto>(
      `https://gitlab.com/api/v4/users/${userID}`,
      {
        headers: {
          'PRIVATE-TOKEN': 'Bearer ' + this.OAuthService.getAccessToken(),
        },
      }
    );
  }

  getProfileData(): Observable<UserExtraDto> {
    return this.httpClient.get<UserExtraDto>(`https://gitlab.com/api/v4/user`, {
      headers: {
        'PRIVATE-TOKEN': 'glpat-zPMgUWVA7dKdxZ7dGzn2',
      },
    });
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
        headers: {
          'PRIVATE-TOKEN': 'glpat-zPMgUWVA7dKdxZ7dGzn2',
        },
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
      headers: {
        'PRIVATE-TOKEN': 'glpat-zPMgUWVA7dKdxZ7dGzn2',
      },
      params: params,
    });
  }
}
