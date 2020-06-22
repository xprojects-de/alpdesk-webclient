import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileElement } from '../../model/element';

export interface RenameDialogData {
  element: FileElement;
}

@Component({
  selector: 'app-renamedialog',
  templateUrl: './renameDialog.component.html',
  styleUrls: ['./renameDialog.component.css']
})
export class RenameDialogComponent implements OnInit {

  elementName: string;

  constructor(public dialogRef: MatDialogRef<RenameDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: RenameDialogData) {
    this.elementName = data.element.name;
  }

  ngOnInit() { }
}
