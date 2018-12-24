import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

export interface User {
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

const SUB_DOMAIN_KEY: string = 'sub_domain';
const USER_KEY: string = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User = null;
  private authenticated: boolean = false;
  private subDomain: string = null;
  private readonly headers: HttpHeaders = new HttpHeaders({
    'Authorization': `${environment.api.udemy.auth.type} ${environment.api.udemy.auth.credentials}`
  });

  constructor(
      private readonly http: HttpClient,
      private readonly router: Router
  ) {
  }

  login(email: string, password: string, domain?: string): Observable<User> {
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
          this.initSession(value, domain);
          return value;
        })
    );
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getSubDomain(): string {
    return this.subDomain;
  }

  getUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.user!.access_token;
  }

  logout(): void {
    this.destroySession();
    this.router.navigate(['/login']);
  }

  private destroySession(): void {
    this.user = null;
    this.subDomain = null;
    this.authenticated = false;
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SUB_DOMAIN_KEY);
  }

  private initSession(user: User, domain?: string): void {
    this.user = user;
    this.subDomain = domain || environment.api.udemy.subDomain;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(SUB_DOMAIN_KEY, this.subDomain);
    this.authenticated = true;
  }

  public restoreSession(): boolean {
    if (localStorage.getItem(USER_KEY) == null) {
      this.user = null;
      this.subDomain = null;
      this.authenticated = false;
      return false;
    } else {
      this.user = JSON.parse(localStorage.getItem(USER_KEY));
      this.subDomain = localStorage.getItem(SUB_DOMAIN_KEY);
      this.authenticated = true;
      return true;
    }
  }
}
