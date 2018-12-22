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
  private user: User;
  private readonly headers: HttpHeaders = new HttpHeaders({
    'Authorization': `Basic API_BASIC_KEY`
  });


  constructor(
      private readonly http: HttpClient
  ) {
  }



  login(email: string, password: string): Observable<boolean> {
    return this.http.post<User>(
        "https://www.udemy.com/api-2.0/auth/udemy-auth/login/",
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
            return true;
          } else {
            return false;
          }
        })
    )
  }

  isAuthenticated(): boolean {
    return false;
  }

  getUser(): User {
    return this.user;
  }
}