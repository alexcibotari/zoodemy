import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/service/auth.service';

@Component({
  selector: 'zd-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

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
