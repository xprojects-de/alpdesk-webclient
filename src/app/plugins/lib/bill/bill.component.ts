import { Component, OnInit, Input } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/basedata/base/base.component';
import { IBill } from './ibill';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent extends BaseComponent implements OnInit {

  @Input() public billInfo: IBill = { address: '', billnumber: '', subject: '', items: [] };

  // tslint:disable-next-line: max-line-length
  constructor(public rest: RestService, public router: Router, public deviceService: DeviceDetectorService, public dialog: MatDialog, public snackBar: MatSnackBar) {
    super(rest, router, deviceService, snackBar);
    this.watchdogEnabled = false;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  submit() {
    if (this.billInfo.items.length > 0) {
      if (this.billInfo.billnumber !== '' && this.billInfo.subject !== '' && this.billInfo.address !== '') {
        this.rest.plugin('billofferlib', { "method": "bill", "param": this.billInfo }).subscribe(
          res => {
            if (res !== null && res !== undefined) {
              this.showSnackBar('Bill successfully created');
              this.rest.log(res);
            } else {
              this.showSnackBar('Error creating Bill');
              this.rest.log(res);
            }
          },
          error => {
            this.rest.log(error);
            this.showSnackBar('Error creating Bill');
          },
          () => {
          }
        );
      } else {
        this.showSnackBar('Please fillout all fields');
      }
    } else {
      this.showSnackBar('No issue selected');
    }
  }

}

