import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {ElectronService} from 'ngx-electron';

const SUB_DOMAIN_KEY: string = 'sub_domain';
const TOKEN_KEY: string = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string = null;
  private authenticated: boolean = false;
  private subDomain: string = null;

  constructor(
    private readonly router: Router,
    private readonly electronService: ElectronService
  ) {
  }

  login(domain?: string): void {
    let url: string = 'https://www.udemy.com/join/login-popup';
    if (domain) {
      url = `https://${domain}.udemy.com`;
    }
    const loginWindow: Window = window.open(url, 'modal');
    this.electronService.remote.session.defaultSession.webRequest.onBeforeSendHeaders(
      { urls: ['*://*.udemy.com/*'] },
      (request, callback) => {
        if (request.requestHeaders.Authorization) {
          const accessToken: string =  request.requestHeaders.Authorization.split(' ')[1];
          const subDomain: string =  new URL(request.url).hostname.split('.')[0];
          this.initSession(accessToken, domain);
          console.log('access_token', accessToken);
          console.log('subdomain', subDomain);
          loginWindow.close();
          this.router.navigate(['/dashboard']);
        }
        callback({ requestHeaders: request.requestHeaders });
      }
    );
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getSubDomain(): string {
    return this.subDomain;
  }
  getToken(): string | null {
    return this.token;
  }

  logout(): void {
    this.destroySession();
    this.router.navigate(['/login']);
  }

  private destroySession(): void {
    this.token = null;
    this.subDomain = null;
    this.authenticated = false;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SUB_DOMAIN_KEY);
  }

  private initSession(token: string, domain?: string): void {
    this.token = token;
    this.subDomain = domain || environment.api.udemy.subDomain;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(SUB_DOMAIN_KEY, this.subDomain);
    this.authenticated = true;
  }

  public restoreSession(): boolean {
    if (localStorage.getItem(TOKEN_KEY) == null) {
      this.token = null;
      this.subDomain = null;
      this.authenticated = false;
      return false;
    } else {
      this.token = localStorage.getItem(TOKEN_KEY);
      this.subDomain = localStorage.getItem(SUB_DOMAIN_KEY);
      this.authenticated = true;
      return true;
    }
  }
}
