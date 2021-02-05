import {Component, OnInit} from '@angular/core';
import {OsUtil} from '../core/os.util';

@Component({
  selector: 'zd-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
  ) {
  }

  ngOnInit(): void {
  }

  getHomePath(): string {
    return OsUtil.getHomePath();
  }

}
