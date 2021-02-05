import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/service/auth.service';

@Component({
  selector: 'zd-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide: boolean = true;
  loginForm: FormGroup = new FormGroup({
    isBusiness: new FormControl(true, Validators.required),
    businessName: new FormControl('sunrise'),
  });

  constructor(
      private readonly auth: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.loginForm.value.isBusiness) {
      this.auth.login(this.loginForm.value.businessName);
    } else {
      this.auth.login();
    }
  }
}
