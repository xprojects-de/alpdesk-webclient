import {Component, OnInit} from '@angular/core';
import {BaseComponent} from 'src/app/basedata/base/base.component';
import {RestService} from 'src/app/services/rest.service';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatSnackBar} from '@angular/material/snack-bar';
import {IMandant} from 'src/app/interfaces/imandant';

@Component({
    selector: 'app-mandant',
    templateUrl: './mandant.component.html',
    styleUrls: ['./mandant.component.scss']
})
export class MandantComponent extends BaseComponent {

    mandant: IMandant = {
        username: '',
        alpdesk_token: '',
        mandantId: 0,
        plugins: [],
        data: [],
        accessFinderCopy: false,
        accessFinderCreate: false,
        accessFinderDelete: false,
        accessFinderDownload: false,
        accessFinderMove: false,
        accessFinderRename: false,
        accessFinderUpload: false
    };
    loaded: boolean = false;

    constructor(public rest: RestService, public router: Router, public deviceService: DeviceDetectorService, public snackBar: MatSnackBar) {
        super(rest, router, deviceService, snackBar);
    }

    ngOnInit() {
        super.ngOnInit();
        this.loadMandant();
    }

    private loadMandant() {
        this.loaded = false;
        this.rest.mandant().subscribe(
            res => {
                const data: IMandant = res as IMandant;
                this.log(res);
                if (res !== null && res !== undefined) {
                    this.log(data);
                    this.mandant = data;
                }
                this.loaded = true;
            },
            error => {
                this.log(error);
                this.showSnackBar('Error loading CustomerList');
            },
            () => {
            }
        );
    }

}
