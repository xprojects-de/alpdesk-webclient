import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './auth/auth.component';
import { Routes, RouterModule } from '@angular/router';
import { AppConfigService } from './services/app-config.service';
import { HttpClientModule } from '@angular/common/http';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BaseComponent } from './basedata/base/base.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { MandantComponent } from './mandant/mandant/mandant.component';
import { FinderComponent } from './plugins/finder/finder.component';
import { FileExplorerComponent } from './plugins/lib/file-explorer/file-explorer.component';
import { NewFolderDialogComponent } from './plugins/lib/file-explorer/modals/newFolderDialog/newFolderDialog.component';
import { RenameDialogComponent } from './plugins/lib/file-explorer/modals/renameDialog/renameDialog.component';
import { UploadComponent } from './plugins/lib/upload/upload.component';
import { HelloComponent } from './plugins/hello/hello.component';
import { JiraComponent } from './plugins/jiracontainer/jira/jira.component';
import { BillComponent } from './plugins/lib/bill/bill.component';
import { OfferComponent } from './plugins/offer/offer.component';
import { AutomationComponent } from './plugins/automationcontainer/automation/automation.component';
import { CustomContainerComponent } from './plugins/customcontainer/custom-container/custom-container.component';

const appRoutes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'customcontainer', component: CustomContainerComponent },
  { path: 'hello', component: HelloComponent },
  { path: 'jira', component: JiraComponent },
  { path: 'offer', component: OfferComponent },
  { path: 'finder', component: FinderComponent },
  { path: 'automation', component: AutomationComponent },
  { path: '**', component: AuthComponent }
];

export function initializeApp(appConfig: AppConfigService) {
  return () => appConfig.load();
}
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    BaseComponent,
    DashboardComponent,
    MandantComponent,
    NewFolderDialogComponent,
    RenameDialogComponent,
    FinderComponent,
    FileExplorerComponent,
    UploadComponent,
    HelloComponent,
    JiraComponent,
    BillComponent,
    OfferComponent,
    AutomationComponent,
    CustomContainerComponent
  ],
  entryComponents: [
    NewFolderDialogComponent,
    RenameDialogComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { 
        enableTracing: false,
        onSameUrlNavigation: 'reload'
      }
    ),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DeviceDetectorModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FlexLayoutModule,
    MatGridListModule
  ],
  providers: [
    AppConfigService, {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService], multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class AppModule { }
