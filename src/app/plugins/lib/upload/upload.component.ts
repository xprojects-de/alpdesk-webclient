import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @ViewChild('fileUpload') fileUpload: ElementRef; files = [];
  @Input() public targetPath: string = '/';

  loggingEnabled = AppConfigService.settings.logging.enabled;

  constructor(public rest: RestService) { }

  ngOnInit() {
    this.log(this.targetPath);
  }

  log(message: any) {
    if (this.loggingEnabled) {
      console.log(message);
    }
  }

  private uploadFiles() {
    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      if (file.complete === false) {
        this.uploadFile(file);
      }
    });
  }

  onClick() {
    if(this.targetPath === undefined) {
      this.targetPath = '/';
    }
    const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({ data: file, inProgress: false, progress: 0, complete: false });
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }

  uploadFile(file) {
    if(this.targetPath === undefined) {
      this.targetPath = '/';
    }
    const formData: FormData = new FormData();
    formData.append('file', file.data);
    formData.append('alpdesk_token', this.rest.alpdesk_token);
    formData.append('target', this.targetPath);
    file.inProgress = true;
    file.complete = false;
    this.rest.upload(formData).pipe(
      map(event => {
        this.log(event);
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.log(error);
        file.inProgress = false;
        file.complete = false;
        return of(`${file.data.name} upload failed.`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          this.log(event.body);
          file.complete = true;
        }
      });
  }
}

