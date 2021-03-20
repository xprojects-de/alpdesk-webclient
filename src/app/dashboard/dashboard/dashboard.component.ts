import {Component, OnInit} from '@angular/core';
import {BaseComponent} from 'src/app/basedata/base/base.component';
import {RestService} from 'src/app/services/rest.service';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {FormBuilder} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {IMandant} from 'src/app/interfaces/imandant';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent {

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

    constructor(public rest: RestService, public router: Router, public deviceService: DeviceDetectorService, private formBuilder: FormBuilder, public snackBar: MatSnackBar) {
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
                    this.checkFinderAccess(data);
                    this.mandant = data;
                    if (this.mandant.plugins.length == 1) {
                        if (this.mandant.plugins[0].customTemplate === true) {
                            this.navigateTo('/customcontainer', {plugin: this.mandant.plugins[0].value, params: null});
                        } else {
                            this.navigateTo(this.mandant.plugins[0].value);
                        }
                    }
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

    private checkFinderAccess(mandant: IMandant) {
        if (mandant.accessFinderUpload === true &&
            mandant.accessFinderRename === true &&
            mandant.accessFinderMove === true &&
            mandant.accessFinderDownload === true &&
            mandant.accessFinderCopy === true &&
            mandant.accessFinderCreate === true &&
            mandant.accessFinderDelete === true) {
            mandant.plugins.push({value: 'finder', label: 'Finder', customTemplate: false});
        }
    }

}
