import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService, User} from '../core/auth.service';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

@Component({
  selector: 'zc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide: boolean = true;
  loginForm: FormGroup = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    isBusiness: new FormControl(false, Validators.required),
    businessName: new FormControl(''),
  });

  constructor(
      private readonly auth: AuthService,
      private readonly snackBar: MatSnackBar,
      private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    let login: Observable<User>;
    if (this.loginForm.value.isBusiness) {
      login = this.auth.login(this.loginForm.value.login, this.loginForm.value.password);
    } else {
      login = this.auth.login(this.loginForm.value.login, this.loginForm.value.password, this.loginForm.value.businessName);
    }
    login.subscribe(value => {
      this.snackBar.open(
          `Welcome ${value.display_name}.`,
          '',
          {
            duration: environment.message.duration
          }
      );
      this.router.navigate(['/dashboard']);
    });
  }
}
