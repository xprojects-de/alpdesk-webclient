import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/basedata/base/base.component';
import { IJiraIssue } from '../ijira-issue';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IBill } from '../../lib/bill/ibill';
import { RestService } from 'src/app/services/rest.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IWorklog } from '../iworklog';
import { IBillItems } from '../../lib/bill/ibill-items';

@Component({
  selector: 'app-jira',
  templateUrl: './jira.component.html',
  styleUrls: ['./jira.component.scss']
})
export class JiraComponent extends BaseComponent implements OnInit {

  selectedOptions = [];
  issues: IJiraIssue[] = [];
  loaded: boolean = false;
  jiraForm: FormGroup;
  billInfo: IBill = { address: '', billnumber: '', subject: '', items: [] };

  // tslint:disable-next-line: max-line-length
  constructor(public rest: RestService, public router: Router, public deviceService: DeviceDetectorService, public dialog: MatDialog, private formBuilder: FormBuilder, public snackBar: MatSnackBar) {
    super(rest, router, deviceService, snackBar);
    this.jiraForm = this.formBuilder.group({
      hours: [[]]
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadJiraTasks();
  }

  private loadJiraTasks() {
    this.issues = [];
    this.loaded = false;
    this.rest.plugin('jira', { "method": "status", "param": "Rechnung" }).subscribe(
      res => {
        this.rest.log(res);
        if (res !== null && res !== undefined) {
          if (res.data.items.length > 0) {
            res.data.items.forEach((cust: IJiraIssue) => {
              cust.completeHours = '';
              cust.completeprices = '';
              cust.worklogs = [];
              this.issues.push(cust);
            });
          }
          this.issues.forEach((issue: IJiraIssue) => {
            this.loadWorklog(issue);
          });
          this.loaded = true;
        }
      },
      error => {
        this.rest.log(error);
        this.showSnackBar('Error loading Issues');
      },
      () => {
      }
    );
  }

  private loadWorklog(issue: IJiraIssue): void {
    this.rest.plugin('jira', { "method": "worklog", "param": issue.key }).subscribe(
      res => {
        this.rest.log(res);
        if (res !== null && res !== undefined) {
          const item: IJiraIssue = (res.data.items[0] as IJiraIssue);
          issue.completeHours = item.completeHours;
          issue.completeprices = item.completeprices;
          item.worklogs.forEach((worklog: IWorklog) => {
            issue.worklogs.push(worklog);
          });          
        }
      },
      error => {
        this.rest.log(error);
        this.showSnackBar('Error loading Worklog');
      },
      () => {
      }
    );
  }

  onSelectedOptionsChange($event: any) {
    this.billInfo.items = [];
    if ($event.length > 0) {
      $event.forEach((issue: IJiraIssue) => {
        const billIssue: IBillItems = {
          label: issue.summary + ' (' + issue.completeHours + 'h)',
          value: issue.completeprices
        };
        this.billInfo.items.push(billIssue);
      });
    }
  }

}

