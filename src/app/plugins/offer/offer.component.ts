import { Component, OnInit } from '@angular/core';
import { IOffer } from './ioffer';
import { RestService } from 'src/app/services/rest.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/basedata/base/base.component';
import { IOfferItems } from './ioffer-items';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent extends BaseComponent implements OnInit {

  offer: IOffer = { address: '', subject: '', items: [] };

  // tslint:disable-next-line: max-line-length
  constructor(public rest: RestService, public router: Router, public deviceService: DeviceDetectorService, public dialog: MatDialog, public snackBar: MatSnackBar) {
    super(rest, router, deviceService, snackBar);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  add(): void {
    this.offer.items.push({ label: '', value: 0.0, optional: false });
  }

  remove(offer: IOfferItems): void {
    if (confirm('Really delete this item?')) {
      const updatedArray: IOfferItems[] = [];
      for (const el of this.offer.items) {
        if (el !== offer) {
          updatedArray.push(el);
        }
      }
      this.offer.items = updatedArray;
    }
  }

  submit() {
    if (this.offer.items.length > 0) {
      if (this.offer.subject !== '' && this.offer.address !== '') {
        this.rest.plugin('billofferlib', { "method": "offer", "param": this.offer }).subscribe(
          res => {
            if (res !== null && res !== undefined) {
              this.showSnackBar('Offer successfully created');
              this.rest.log(res);
            } else {
              this.showSnackBar('Error creating Offer');
              this.rest.log(res);
            }
          },
          error => {
            this.rest.log(error);
            this.showSnackBar('Error creating Offer');
          },
          () => {
          }
        );
      } else {
        this.showSnackBar('Please fillout all fields');
      }
    } else {
      this.showSnackBar('No position selected');
    }
  }

}
