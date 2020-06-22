import { Component } from '@angular/core';
import { AppConfigService } from './services/app-config.service';
import { RestService } from './services/rest.service';
import { BaseComponent } from './basedata/base/base.component';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IAuth } from './interfaces/iauth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent {
  title = 'alpdesk-client';
  version = AppConfigService.settings.version;

  constructor(public rest: RestService, public router: Router, public deviceService: DeviceDetectorService,  public snackBar: MatSnackBar) {
    super(rest, router, deviceService, snackBar);
    this.watchdogEnabled = false;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  logout() {
    this.rest.logout().subscribe(
      res => {
        this.log(res);
        if (res !== null && res !== undefined) {
          this.rest.resetSessionData();
          this.showSnackBar('Logout successfully');
          this.navigateTo('/login');
        } else {
          this.showSnackBar('Error at Logout');
        }
      },
      error => {
        this.log(error);
        this.showSnackBar('Error at Logout');
      },
      () => { }
    );
  }

}
