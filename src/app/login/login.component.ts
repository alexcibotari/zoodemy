import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {AuthService} from '../shared/service/auth.service';
import {User} from '../shared/model/user.model';

@Component({
  selector: 'zd-login',
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
      login = this.auth.login(this.loginForm.value.login, this.loginForm.value.password, this.loginForm.value.businessName);
    } else {
      login = this.auth.login(this.loginForm.value.login, this.loginForm.value.password);
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
        },
        (error) => {
          console.log(error);
          this.snackBar.open(
              `User or Password is wrong.`,
              '',
              {
                duration: environment.message.duration
              }
          );
        });
  }
}
