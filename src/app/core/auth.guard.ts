import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
      private readonly auth: AuthService,
      private readonly router: Router) {
  }

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }
    if (this.auth.restoreSession()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
