import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/basedata/base/base.component';
import { IAutomationResult, IAutomationItems, IAutomationItemsChanges, IAutomationItemsValue, IAutomationItemsValueProperties } from '../iautomation-items';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.scss']
})
export class AutomationComponent extends BaseComponent implements OnInit {

  loaded: boolean = false;
  automationResult: IAutomationResult = { error: true, items: [], changes: [] };

  // tslint:disable-next-line: max-line-length
  constructor(public rest: RestService, public router: Router, public deviceService: DeviceDetectorService, public dialog: MatDialog, public snackBar: MatSnackBar) {
    super(rest, router, deviceService, snackBar);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadItems();
  }

  loadItems() {
    this.automationResult.error = true;
    this.automationResult.items = [];
    this.automationResult.changes = [];
    this.loaded = false;
    this.rest.plugin('automation', { "method": "list", "params": "" }).subscribe(
      res => {
        this.rest.log(res);
        if (res !== null && res !== undefined) {
          const resAuto: IAutomationResult = (res.data as IAutomationResult);
          if (resAuto.error === false) {

            // device.devicevalue.type === 2000 && (property.value === 'ON' || property.value === 'OFF')
            if (resAuto.items.length > 0) {
              resAuto.items.forEach((item: IAutomationItems) => {
                const itemProps: IAutomationItemsValue = (item.devicevalue as IAutomationItemsValue);
                if (itemProps.properties.length > 0) {
                  itemProps.properties.forEach((propertyItem: IAutomationItemsValueProperties) => {
                    if (propertyItem.editable === true && propertyItem.stateful === true || (item.devicevalue.type === 2000 && (propertyItem.value === 'ON' || propertyItem.value === 'OFF'))) {
                      propertyItem.toggleEnabled = true;
                    }
                  });
                }
              });
            }

            if (resAuto.changes.length > 0) {
              resAuto.changes.forEach((changedItem: IAutomationItemsChanges) => {
                resAuto.items.forEach((checkItem: IAutomationItems) => {
                  if (changedItem.devicehandle === checkItem.devicehandle) {
                    const checkItemProps: IAutomationItemsValue = (checkItem.devicevalue as IAutomationItemsValue);
                    if (checkItemProps.properties.length > 0) {
                      checkItemProps.properties.forEach((propertyItem: IAutomationItemsValueProperties) => {
                        if (propertyItem.handle === changedItem.devicevalue.propertiehandle) {
                          propertyItem.changed = true;
                        }
                      });
                    }
                  }
                });
              });
            }
            this.automationResult = resAuto;
            this.showSnackBar('Loading Items ok');
          } else {
            this.rest.log(res);
            this.showSnackBar('Error loading Items');
          }
          this.loaded = true;
        }
      },
      error => {
        this.rest.log(error);
        this.showSnackBar('Error loading Items');
      },
      () => {
      }
    );
  }

  toggle(deviceHandle: string, propertiehandle: number, value: string): void {
    const newValue: number = (value === 'ON' ? 0 : 1);
    const toggleItem = {
      devicehandle: Number(deviceHandle), devicevalue: {
        devicehandle: Number(deviceHandle), propertiehandle, value: newValue
      }
    };
    this.rest.log(toggleItem);
    this.rest.plugin('automation', { "method": "change", "params": toggleItem }).subscribe(
      res => {
        this.rest.log(res);
        if (res !== null && res !== undefined) {
          const resAuto: IAutomationResult = (res.data as IAutomationResult);
          if (resAuto.error === false) {
            this.showSnackBar('Modify Item ok');
            this.loadItems();
          } else {
            this.rest.log(res);
            this.showSnackBar('Error modify Items');
          }
          this.loaded = true;
        }
      },
      error => {
        this.rest.log(error);
        this.showSnackBar('Error modify Items');
      },
      () => {
      }
    );
  }

}
