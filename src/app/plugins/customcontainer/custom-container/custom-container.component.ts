import {Component, OnInit, ElementRef, ViewChild, OnDestroy, HostListener} from '@angular/core';
import {BaseComponent} from 'src/app/basedata/base/base.component';
import {RestService} from 'src/app/services/rest.service';
import {Router, ActivatedRoute} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ICustomContainer} from '../icustom-container';
import {IMandant, IMandantPlugin} from 'src/app/interfaces/imandant';

@Component({
    selector: 'app-custom-container',
    templateUrl: './custom-container.component.html',
    styleUrls: ['./custom-container.component.scss']
})
export class CustomContainerComponent extends BaseComponent implements OnInit, OnDestroy {

    private plugin: string = '';
    private pluginParams: any = '';
    loaded: boolean = false;
    styles?: string[];
    scripts?: string[];
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
    @ViewChild('customContainerTemplate') customContainerTemplate: ElementRef;

    private checkTargetForNull(param: any): boolean {
        return (param !== null && param !== undefined);
    }

    @HostListener('document:alpdesk', ['$event']) onAlpdeskEvent(event: CustomEvent) {
        const params = event.detail;
        this.log(params);
        if (this.checkTargetForNull(params)) {
            if (this.checkTargetForNull(params.type)) {
                switch (params.type) {
                    case 'route': {
                        if (this.checkTargetForNull(params.target)) {
                            if (this.mandant.plugins.length > 0) {
                                let finalRoute: string = params.target;
                                let triggerNav: boolean = false;
                                for (var i = 0; i < this.mandant.plugins.length; i++) {
                                    const mPlugin: IMandantPlugin = this.mandant.plugins[i];
                                    if (mPlugin.value === finalRoute) {
                                        if (mPlugin.customTemplate === true) {
                                            this.plugin = params.target;
                                            if (this.checkTargetForNull(params.params)) {
                                                this.pluginParams = params.params;
                                            }
                                            triggerNav = true;
                                        }
                                        break;
                                    }
                                }
                                if (triggerNav === true) {
                                    this.disableStyle();
                                    this.disableScripts();
                                    this.loadPlugin();
                                } else {
                                    this.navigateTo(finalRoute);
                                }

                            }
                        }
                        break;
                    }
                    default:
                        break;
                }
            }
        }
    }

    constructor(public rest: RestService, private route: ActivatedRoute, public router: Router, public deviceService: DeviceDetectorService, public dialog: MatDialog, public snackBar: MatSnackBar) {
        super(rest, router, deviceService, snackBar);
        const rParams = (router.getCurrentNavigation().extras.state as { plugin: string, params: any });
        this.log(rParams);
        this.plugin = rParams.plugin;
        this.pluginParams = rParams.params;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.loadPlugin();
    }

    ngOnDestroy(): void {
        super.ngOnInit();
        this.disableStyle();
        this.disableScripts();
    }

    private importStyle() {
        if (this.styles !== null && this.styles !== undefined) {
            this.styles.forEach((styleItem: string) => {
                let stillLoaded: boolean = false;
                for (var i = 0; i < document.styleSheets.length; i++) {
                    const sheet: StyleSheet = document.styleSheets[i];
                    if (sheet.href !== null && sheet.href === styleItem) {
                        stillLoaded = true;
                        this.log(styleItem + ' still loaded');
                        sheet.disabled = false;
                        this.log(styleItem + ' enabled');
                        break;
                    }
                }
                if (stillLoaded === false) {
                    let newSS: HTMLLinkElement = document.createElement('link');
                    newSS.rel = 'stylesheet';
                    newSS.href = styleItem;
                    document.getElementsByTagName('head')[0].appendChild(newSS);
                    this.log(styleItem + ' added');
                }
            });
        }
    }

    private disableStyle() {
        if (this.styles !== null && this.styles !== undefined) {
            this.styles.forEach((styleItem: string) => {
                for (var i = 0; i < document.styleSheets.length; i++) {
                    const sheet: StyleSheet = document.styleSheets[i];
                    if (sheet.href !== null && sheet.href === styleItem) {
                        sheet.disabled = true;
                        this.log(styleItem + ' disabled');
                        break;
                    }
                }
            });
        }
    }

    private importScripts() {
        if (this.scripts !== null && this.scripts !== undefined) {
            this.scripts.forEach((scriptItem: string) => {
                let stillLoaded: boolean = false;
                for (var i = 0; i < document.scripts.length; i++) {
                    const script: HTMLScriptElement = document.scripts[i];
                    if (script.src !== null && script.src === scriptItem) {
                        stillLoaded = true;
                        this.log(scriptItem + ' still loaded');
                        break;
                    }
                }
                if (stillLoaded === false) {
                    let newJS: HTMLScriptElement = document.createElement('script');
                    newJS.src = scriptItem;
                    newJS.defer = false;
                    newJS.async = false;
                    document.getElementsByTagName('head')[0].appendChild(newJS);
                    this.log(scriptItem + ' added');
                }
            });
        }
    }

    private disableScripts() {
        if (this.scripts !== null && this.scripts !== undefined) {
            this.scripts.forEach((scriptItem: string) => {
                for (var i = 0; i < document.scripts.length; i++) {
                    const script: HTMLScriptElement = document.scripts[i];
                    if (script.src !== null && script.src === scriptItem) {
                        script.remove();
                        this.log(scriptItem + ' disabled');
                        break;
                    }
                }
            });
        }
    }

    private loadMandant() {
        this.rest.mandant().subscribe(
            res => {
                const data: IMandant = res as IMandant;
                this.log(res);
                if (res !== null && res !== undefined) {
                    this.mandant = data;
                }
            },
            error => {
                this.log(error);
            },
            () => {
            }
        );
    }

    private loadPlugin() {
        this.loaded = false;
        if (this.customContainerTemplate !== null && this.customContainerTemplate !== undefined) {
            this.customContainerTemplate.nativeElement.innerHTML = '';
        }
        this.loadMandant();
        let params = {};
        if (this.pluginParams !== null && this.pluginParams !== undefined) {
            params = this.pluginParams;
        }
        this.rest.plugin(this.plugin, params).subscribe(
            res => {
                this.rest.log(res);
                if (res !== null && res !== undefined) {
                    const p: ICustomContainer = (res.data as ICustomContainer);
                    if (p.ngStylesheetUrl !== null && p.ngStylesheetUrl !== undefined) {
                        if (p.ngStylesheetUrl.length > 0) {
                            this.styles = p.ngStylesheetUrl;
                            this.importStyle();
                        }
                    }
                    this.customContainerTemplate.nativeElement.innerHTML = p.ngContent;
                    if (p.ngScriptUrl !== null && p.ngScriptUrl !== undefined) {
                        if (p.ngScriptUrl.length > 0) {
                            this.scripts = p.ngScriptUrl;
                            this.importScripts();
                        }
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

}
