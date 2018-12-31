import {Component, OnInit} from '@angular/core';
import {User} from '../shared/model/user.model';
import {AuthService} from '../shared/service/auth.service';
import {OsUtil} from '../core/os.util';

@Component({
  selector: 'zd-dashboard',
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

  getHomePath(): string {
    return OsUtil.getHomePath();
  }

}
