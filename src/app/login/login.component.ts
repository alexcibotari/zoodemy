import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'ut-login',
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

  constructor() {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {

  }
}
