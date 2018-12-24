import {Component, OnInit} from '@angular/core';
import {AuthService, User} from '../core/auth.service';

@Component({
  selector: 'zc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user: User;

  constructor(
      private readonly auth: AuthService
  ) {
  }

  ngOnInit(): void {
    this.user = this.auth.getUser();
  }

}
