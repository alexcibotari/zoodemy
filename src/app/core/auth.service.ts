import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

interface User {
  _class: string;
  id: number;
  title: string;
  name: string;
  display_name: string;
  job_title: string;
  image_50x50: string;
  image_100x100: string;
  initials: string;
  url: string;
  is_generated: boolean;
  access_token: string;
}

@Injectable()
export class AuthService {
  private user: User = null;
  private authenticated: boolean = false;
  private readonly headers: HttpHeaders = new HttpHeaders({
    'Authorization': `Basic API_BASIC_KEY`
  });

  constructor(
      private readonly http: HttpClient
  ) {
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<User>(
        'https://www.udemy.com/api-2.0/auth/udemy-auth/login/',
        {
          email: email,
          password: password
        },
        {
          headers: this.headers
        }
    )
    .pipe(
        map(value => {
          if (value) {
            this.user = value;
            this.authenticated = true;
            return true;
          } else {
            return false;
          }
        })
    );
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.user!.access_token;
  }

  logout(): void {
    this.user = null;
    this.authenticated = false;
  }
}
