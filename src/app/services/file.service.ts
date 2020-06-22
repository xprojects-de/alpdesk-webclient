import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { FileElement } from '../plugins/lib/file-explorer/model/element';

export interface IFileService {
  add(fileElement: FileElement);
  delete(id: string);
  update(id: string, update: Partial<FileElement>);
  queryInFolder(folderId: string): Observable<FileElement[]>;
  get(id: string): FileElement;
}

@Injectable({
  providedIn: 'root'
})
export class FileService implements IFileService {

  constructor() { }
  private map = new Map<string, FileElement>();

  private querySubject: BehaviorSubject<FileElement[]>;
  private querySubjectParent: BehaviorSubject<FileElement[]>;

  add(fileElement: FileElement) {
    this.map.set(fileElement.id, this.clone(fileElement));
    return fileElement;
  }

  delete(id: string) {
    this.map.delete(id);
  }

  update(id: string, update: Partial<FileElement>) {
    let element = this.map.get(id);
    element = Object.assign(element, update);
    this.map.set(element.id, element);
  }

  queryInFolder(folderId: string) {
    const result: FileElement[] = [];
    this.map.forEach(element => {
      if (element.parent === folderId) {
        result.push(this.clone(element));
      }
    });
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }

  queryInFolderParent(folderId: string) {
    const result: FileElement[] = [];
    this.map.forEach(element => {
      if (element.parent === folderId) {
        result.push(this.clone(element));
      }
    });
    if (!this.querySubjectParent) {
      this.querySubjectParent = new BehaviorSubject(result);
    } else {
      this.querySubjectParent.next(result);
    }
    return this.querySubjectParent.asObservable();
  }

  get(id: string) {
    return this.map.get(id);
  }

  clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element));
  }

  clear() {
    this.map.clear();
  }
}
