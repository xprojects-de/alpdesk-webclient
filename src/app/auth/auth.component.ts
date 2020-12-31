import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../basedata/base/base.component';
import {FormGroup, FormBuilder} from '@angular/forms';
import {RestService} from '../services/rest.service';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatSnackBar} from '@angular/material/snack-bar';
import {IAuth} from '../interfaces/iauth';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent extends BaseComponent {

  loginForm: FormGroup;

  // tslint:disable-next-line: max-line-length
  constructor(public rest: RestService, public router: Router, public deviceService: DeviceDetectorService, private formBuilder: FormBuilder, public snackBar: MatSnackBar) {
    super(rest, router, deviceService, snackBar);
    this.watchdogEnabled = false;
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
  }

  submitLoginForm() {
    this.rest.login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe(
        res => {
          this.log(res);
          if (res !== null && res !== undefined) {
            this.rest.setSessionData(res as IAuth);
            this.showSnackBar('Login successfully');
            this.navigateTo('/dashboard');
          } else {
            this.showSnackBar('Error at login');
          }
        },
        error => {
          this.log(error);
          this.showSnackBar('Error at login');
        },
        () => {
        }
      );
  }

}

