import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {RestService} from 'src/app/services/rest.service';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {FormBuilder} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BaseComponent} from 'src/app/basedata/base/base.component';
import {FileElement} from './interfaces/file-element';
import {CollectionViewer, DataSource, SelectionChange} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {map} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {RenameDialogComponent} from './modals/renameDialog/renameDialog.component';
import {NewFolderDialogComponent} from './modals/newFolderDialog/newFolderDialog.component';
import {MatDialog} from '@angular/material/dialog';

export class DynamicFlatNode {
    constructor(public item: FileElement, public level = 1, public expandable = false,
                public isLoading = false) {
    }
}

@Injectable({providedIn: 'root'})
export class DynamicDatabase {

    dataMapFinder = new Map<FileElement, FileElement[]>([]);

    rootLevelNodesFinder: FileElement[] = [];

    public fileElements: Observable<FileElement[]>;

    constructor(public rest: RestService, public snackBar: MatSnackBar) {

    }

    private async loadFinderRootList() {
        const res = await this.rest.finder({'mode': 'list', 'src': '/'});
        if (res !== null && res !== undefined) {
            if (res.length > 0) {
                res.forEach((fe: FileElement) => {
                    this.dataMapFinder.set(fe, []);
                    this.rootLevelNodesFinder.push(fe);
                });
            }
        } else {
            this.snackBar.open('Error loading Elements', 'Close', {duration: 5000});
        }
    }

    private async loadFinderChildList(node: FileElement) {
        this.dataMapFinder.set(node, []);
        const data: FileElement[] = [];
        const res = await this.rest.finder({'mode': 'list', 'src': node.uuid});
        if (res !== null && res !== undefined) {
            if (res.length > 0) {
                res.forEach((fe: FileElement) => {
                    data.push(fe);
                });
                this.dataMapFinder.set(node, data);
            }
        } else {
            this.snackBar.open('Error loading Elements', 'Close', {duration: 5000});
        }
    }

    async initialData(): Promise<DynamicFlatNode[]> {

        this.rootLevelNodesFinder = [];
        this.dataMapFinder.clear();

        await this.loadFinderRootList();
        return new Promise((resolve, reject) => {
            resolve(this.rootLevelNodesFinder.map(name => new DynamicFlatNode(name, 0, true)));
        });
    }

    async getChildren(node: FileElement): Promise<FileElement[]> {
        await this.loadFinderChildList(node);
        return new Promise((resolve, reject) => {
            resolve(this.dataMapFinder.get(node));
        });
    }

    isExpandable(node: FileElement): boolean {
        return this.dataMapFinder.has(node);
    }
}

export class DynamicDataSource implements DataSource<DynamicFlatNode> {

    dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

    get data(): DynamicFlatNode[] {
        return this.dataChange.value;
    }

    set data(value: DynamicFlatNode[]) {
        this._treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    constructor(private _treeControl: FlatTreeControl<DynamicFlatNode>, private _database: DynamicDatabase) {
    }

    connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
        this._treeControl.expansionModel.changed.subscribe(change => {
            if ((change as SelectionChange<DynamicFlatNode>).added ||
                (change as SelectionChange<DynamicFlatNode>).removed) {
                this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
            }
        });

        return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }

    handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
        if (change.added) {
            change.added.forEach(node => this.toggleNode(node, true));
        }
        if (change.removed) {
            change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
        }
    }

    updateChildren(node: DynamicFlatNode): Promise<FileElement[]> {
        return this._database.getChildren(node.item);
    }

    toggleNode(node: DynamicFlatNode, expand: boolean) {

        node.isLoading = true;

        this.updateChildren(node).then(
            (children) => {

                const index = this.data.indexOf(node);
                if (children && index >= 0) {
                    if (expand) {
                        const nodes = children.map(name => new DynamicFlatNode(name, node.level + 1, this._database.isExpandable(name)));
                        this.data.splice(index + 1, 0, ...nodes);
                    } else {
                        let count = 0;
                        for (let i = index + 1; i < this.data.length && this.data[i].level > node.level; i++, count++) {
                        }
                        this.data.splice(index + 1, count);
                    }
                    this.dataChange.next(this.data);
                }

                node.isLoading = false;

            }).catch((error) => {

            node.isLoading = false;

        });
    }
}

@Component({
    selector: 'app-finder',
    templateUrl: './finder.component.html',
    styleUrls: ['./finder.component.scss']
})
export class FinderComponent extends BaseComponent {

    currentFileElement: FileElement = {
        path: '/',
        relativePath: '/',
        uuid: '/',
        extention: '',
        isFolder: true,
        isimage: false,
        name: '/',
        public: false,
        size: 0,
        url: ''
    };

    treeControl: FlatTreeControl<DynamicFlatNode>;
    dataSource: DynamicDataSource;
    getLevel = (node: DynamicFlatNode) => node.level;
    isExpandable = (node: DynamicFlatNode) => node.expandable;
    hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

    pasteElementContainer?: FileElement;
    pastMode = 0;

    constructor(public rest: RestService, public router: Router, public deviceService: DeviceDetectorService, private formBuilder: FormBuilder, public snackBar: MatSnackBar, public database: DynamicDatabase, public dialog: MatDialog) {
        super(rest, router, deviceService, snackBar);

        this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new DynamicDataSource(this.treeControl, database);
        this.init();

    }

    init() {
        this.pasteElementContainer = null;
        this.pastMode = 0;
        this.dataSource.data = [];
        this.currentFileElement = {
            path: '/',
            relativePath: '/',
            uuid: '/',
            extention: '',
            isFolder: true,
            isimage: false,
            name: '/',
            public: false,
            size: 0,
            url: ''
        };

        this.database.initialData().then(
            (success) => {
                this.dataSource.data = success;
            }).catch((error) => {
            this.dataSource.data = [];
        });
    }

    refresh(node: DynamicFlatNode, treeControl: FlatTreeControl<DynamicFlatNode>) {
        treeControl.collapse(node);
    }

    download(element: FileElement) {
        this.log(element);
        this.rest.download(element.uuid).subscribe(
            (res: HttpResponse<Blob>) => {
                this.log(res);
                if (res !== null && res !== undefined) {
                    const a = document.createElement('a');
                    const objectUrl = URL.createObjectURL(res.body);
                    a.href = objectUrl;
                    a.download = element.name;
                    a.click();
                    URL.revokeObjectURL(objectUrl);
                } else {
                    this.log(res);
                    this.showSnackBar('Error downloading File');
                }
            },
            error => {
                this.log(error);
                this.showSnackBar('Error downloading File');
            },
            () => {
            }
        );
    }

    private async createFolder(name: string) {
        const result = await this.rest.finder({
            'mode': 'create',
            'src': this.currentFileElement.relativePath + '/' + name,
            'target': 'dir'
        });
        if (result !== null && result !== undefined) {
            this.showSnackBar('Folder created successfully');
        } else {
            this.showSnackBar('Error creating Folder');
        }
        this.init();
    }

    openCreateFolderDialog() {
        const dialogRef = this.dialog.open(NewFolderDialogComponent, {
            width: '90%'
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res !== null && res !== undefined && res !== '') {
                this.createFolder(res);
            } else {
                this.showSnackBar('Error create Folder');
            }
        });
    }

    async deleteElement(node: DynamicFlatNode, treeControl: FlatTreeControl<DynamicFlatNode>) {
        if (confirm('delete ' + node.item.name + ' ?') === true) {
            const result = await this.rest.finder({'mode': 'delete', 'src': node.item.uuid});
            if (result !== null && result !== undefined) {
                this.showSnackBar('Item deleted successfully');
            } else {
                this.showSnackBar('Error deleting Item');
            }
            this.init();
        }
    }

    private async renameElement(element: FileElement, name: string) {
        const result = await this.rest.finder({'mode': 'rename', 'src': element.uuid, 'target': name});
        if (result !== null && result !== undefined) {
            element.name = name;
            this.showSnackBar('Item renamed successfully');
        } else {
            this.showSnackBar('Error rename Item');
        }
    }

    openRenameDialog(element: FileElement) {

        const dialogRef = this.dialog.open(RenameDialogComponent, {
            width: '90%', data: element
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res !== null && res !== undefined && res !== '') {
                this.renameElement(element, res);
            } else {
                this.showSnackBar('Error rename Item');
            }
        });
    }

    copyElement(element: FileElement) {
        this.pasteElementContainer = element;
        this.pastMode = 1;
    }

    moveElement(element: FileElement) {
        this.pasteElementContainer = element;
        this.pastMode = 2;
    }

    async pasteElement(element: FileElement) {
        if (this.pasteElementContainer !== null && this.pasteElementContainer !== undefined && this.pastMode !== 0) {

            if (this.pastMode === 1) {
                const result = await this.rest.finder({'mode': 'copy', 'src': this.pasteElementContainer.uuid, 'target': element.uuid});
                if (result !== null && result !== undefined) {
                    this.showSnackBar('Item copied successfully');
                } else {
                    this.showSnackBar('Error copy Item');
                }
            } else if (this.pastMode === 2) {
                const result = await this.rest.finder({'mode': 'move', 'src': this.pasteElementContainer.uuid, 'target': element.uuid});
                if (result !== null && result !== undefined) {
                    this.showSnackBar('Item moved successfully');
                } else {
                    this.showSnackBar('Error move Item');
                }
            } else {
                this.showSnackBar('Error paste Item');
            }


        } else {
            this.showSnackBar('Error paste Item');
        }

        this.init();
    }

}
