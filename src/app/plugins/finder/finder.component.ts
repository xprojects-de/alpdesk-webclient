import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FileService } from 'src/app/services/file.service';
import { RestService } from 'src/app/services/rest.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/basedata/base/base.component';
import { FileElement } from '../lib/file-explorer/model/element';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-finder',
  templateUrl: './finder.component.html',
  styleUrls: ['./finder.component.scss']
})
export class FinderComponent extends BaseComponent implements OnInit {

  public fileElements: Observable<FileElement[]>;
  public parentfileElements: Observable<FileElement[]>;

  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;
  loaded: boolean = false;

  // tslint:disable-next-line: max-line-length
  constructor(public rest: RestService, public router: Router, public deviceService: DeviceDetectorService, private formBuilder: FormBuilder, public snackBar: MatSnackBar, public fileService: FileService) {
    super(rest, router, deviceService, snackBar);
  }

  ngOnInit() {
    this.loadFinderList();
  }

  private loadFinderList() {
    this.loaded = false;
    this.fileService.clear();
    this.rest.plugin('finder', { "method": "list" }).subscribe(
      res => {
        this.log(res);
        if (res !== null && res !== undefined) {
          if (res.data !== null && res.data !== undefined) {
            if (res.data.items.length > 0) {
              res.data.items.forEach((fe: FileElement) => {
                this.fileService.add(fe);
              });
            }
            this.loaded = true;
            this.updateFileElementQuery();
          } else {
            this.log(res);
            this.showSnackBar('Error loading Elements');
          }
        } else {
          this.log(res);
          this.showSnackBar('Error loading Elements');
        }
      },
      error => {
        this.log(error);
        this.showSnackBar('Error loading Elements');
      },
      () => {
      }
    );
  }

  addFolder(folder: { name: string }) {
    this.rest.plugin('finder', { "method": "createFolder", "name": folder.name, "parent": (this.currentRoot ? this.currentRoot.id : 'root') }).subscribe(
      res => {
        this.log(res);
        if (res !== null && res !== undefined) {
          if (res.data !== null && res.data !== undefined) {
            this.showSnackBar('creating Element successfully');
            this.loadFinderList();
          } else {
            this.log(res);
            this.showSnackBar('Error loading Elements');
          }
        } else {
          this.log(res);
          this.showSnackBar('Error creating Element');
        }
      },
      error => {
        this.log(error);
        this.showSnackBar('Error creating Element');
      },
      () => {
      }
    );
  }

  removeElement(element: FileElement) {
    if (confirm('Really delete ' + element.name + ' ?')) {
      this.rest.plugin('finder', { "method": "deleteFolder", "name": element.id }).subscribe(
        res => {
          this.log(res);
          if (res !== null && res !== undefined) {
            if (res.data !== null && res.data !== undefined) {
              this.showSnackBar('removing Element successfully');
              this.loadFinderList();
            } else {
              this.log(res);
              this.showSnackBar('Error loading Elements');
            }
          } else {
            this.log(res);
            this.showSnackBar('Error removing Element');
          }
        },
        error => {
          this.log(error);
          this.showSnackBar('Error removing Element');
        },
        () => {
        }
      );
    }
  }

  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    this.updateFileElementQuery();
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUp = true;
  }

  downloadFile(path: string) {
    this.log(path);
    const fileName: string = path.split('/').pop().replace(' ', '_'); 
    this.log(fileName);
    this.rest.download(path).subscribe(
      (res: HttpResponse<Blob>) => {
        this.log(res);
        if (res !== null && res !== undefined) {
          //const keys = res.headers.keys();
          //console.log(keys.map(key => `${key}: ${res.headers.get(key)}`));
          //console.log(res.headers.get('content-disposition'))
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(res.body);
          a.href = objectUrl;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(objectUrl);
        } else {
          this.log(res);
          this.showSnackBar('Error downloading Element');
        }
      },
      error => {
        this.log(error);
        this.showSnackBar('Error downloading Element');
      },
      () => {
      }
    );
  }

  clickToFile(element: FileElement) {
    this.rest.plugin('finder', { "method": "decodeHash", "name": element.id }).subscribe(
      res => {
        this.log(res);
        if (res !== null && res !== undefined) {
          if (res.data !== null && res.data !== undefined) {
            if (res.data.error === false) {
              const path: string = res.data.msg;
              this.downloadFile(path);
              this.showSnackBar('removing Element successfully');
            } else {
              this.log(res);
              this.showSnackBar('Error downloading Elements');
            }
          } else {
            this.log(res);
            this.showSnackBar('Error downloading Elements');
          }
        } else {
          this.log(res);
          this.showSnackBar('Error downloading Element');
        }
      },
      error => {
        this.log(error);
        this.showSnackBar('Error downloading Element');
      },
      () => {
      }
    );
  }

  navigateUp() {
    if (this.currentRoot && this.currentRoot.parent === 'root') {
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.currentRoot = this.fileService.get(this.currentRoot.parent);
      this.updateFileElementQuery();
    }
    this.currentPath = this.popFromPath(this.currentPath);
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    this.rest.plugin('finder', { "method": "move", "name": event.element.id, "destination": event.moveTo.id }).subscribe(
      res => {
        this.log(res);
        if (res !== null && res !== undefined) {
          if (res.data !== null && res.data !== undefined) {
            this.showSnackBar('moving successfully');
            this.loadFinderList();
          } else {
            this.log(res);
            this.showSnackBar('Error moving Element');
          }
        } else {
          this.log(res);
          this.showSnackBar('Error moving Element');
        }
      },
      error => {
        this.log(error);
        this.showSnackBar('Error moving Element');
      },
      () => {
      }
    );
  }

  renameElement(event: { element: FileElement; oldElement: FileElement }) {
    this.rest.plugin('finder', { "method": "renameFolder", "name": event.element.id, "oldname": event.oldElement.name, "newname": event.element.name }).subscribe(
      res => {
        this.log(res);
        if (res !== null && res !== undefined) {
          if (res.data !== null && res.data !== undefined) {
            this.showSnackBar('renaming Element successfully');
            this.loadFinderList();
          } else {
            this.log(res);
            this.showSnackBar('Error renaming Element');
          }
        } else {
          this.log(res);
          this.showSnackBar('Error renaming Element');
        }
      },
      error => {
        this.log(error);
        this.showSnackBar('Error renaming Element');
      },
      () => {
      }
    );

  }

  refresh() {
    this.loadFinderList();
  }

  updateFileElementQuery() {
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
    this.parentfileElements = this.fileService.queryInFolderParent(this.currentRoot ? this.currentRoot.parent : 'root');
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }

}
