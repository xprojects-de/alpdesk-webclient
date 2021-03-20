import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-newfolderdialog',
  templateUrl: './newFolderDialog.component.html',
  styleUrls: ['./newFolderDialog.component.css']
})
export class NewFolderDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<NewFolderDialogComponent>) { }

  folderName: string;

  ngOnInit() { }
}
