import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/service/auth.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'zd-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  isReloadable: boolean = !environment.production;

  constructor(
      private readonly auth: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.auth.logout();
  }

  reload(): void {
    location.reload(true);
  }

}
