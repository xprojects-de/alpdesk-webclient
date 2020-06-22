import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, interval } from 'rxjs';
import { IAuth } from 'src/app/interfaces/iauth';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit, OnDestroy {

  loggingEnabled = AppConfigService.settings.logging.enabled;
  private watchdogSubscription: Subscription;
  public watchdogEnabled: boolean = true;

  // tslint:disable-next-line: max-line-length
  constructor(public rest: RestService, public router: Router, public deviceService: DeviceDetectorService, public snackBar: MatSnackBar) {
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit() {
    this.watchdogSubscription = interval(30000).subscribe(counter => {
      if (this.watchdogEnabled === true) {
        this.rest.verify().subscribe(res => {
          this.log(res);
          if (res !== null && res !== undefined) {
            const status: IAuth = res as IAuth;
            if (status.verify == false) {
              this.rest.resetSessionData();
              this.showSnackBar('Error at Loginstatus');
              this.router.navigate(['/login'], { skipLocationChange: true });
            }
          } else {
            this.showSnackBar('Error at Loginstatus');
            this.router.navigate(['/login'], { skipLocationChange: true });
          }
        },
          error => {
            this.log(error);
            this.showSnackBar('Error at Loginstatus');
            this.router.navigate(['/login'], { skipLocationChange: true });
          },
          () => { }
        );
      }
    });
  }

  ngOnDestroy() {
    if (this.watchdogSubscription) {
      this.watchdogSubscription.unsubscribe();
    }
  }

  showSnackBar(msg: string, durationValue: number = 3000) {
    this.snackBar.open(msg, 'Close', { duration: durationValue });
  }

  navigateTo(route: string, dataRef: any = null) {
    if (dataRef !== null) {
      this.router.navigate([route], { skipLocationChange: true, state: dataRef });
    } else {
      this.router.navigate([route], { skipLocationChange: true });
    }
  }

  log(message: any) {
    if (this.loggingEnabled) {
      console.log(message);
    }
  }

}
