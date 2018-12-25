import {Component, OnInit} from '@angular/core';
import {User} from '../shared/model/user.model';
import {AuthService} from '../shared/service/auth.service';

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
