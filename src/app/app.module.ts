import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './auth/auth.component';
import { AppConfigService } from './services/app-config.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BaseComponent } from './basedata/base/base.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { MandantComponent } from './mandant/mandant/mandant.component';
import { FinderComponent } from './plugins/finder/finder.component';
import { NewFolderDialogComponent } from './plugins/finder/modals/newFolderDialog/newFolderDialog.component';
import { RenameDialogComponent } from './plugins/finder/modals/renameDialog/renameDialog.component';
import { UploadComponent } from './plugins/lib/upload/upload.component';
import { HelloComponent } from './plugins/hello/hello.component';
import { JiraComponent } from './plugins/jiracontainer/jira/jira.component';
import { BillComponent } from './plugins/lib/bill/bill.component';
import { OfferComponent } from './plugins/offer/offer.component';
import { AutomationComponent } from './plugins/automationcontainer/automation/automation.component';
import { CustomContainerComponent } from './plugins/customcontainer/custom-container/custom-container.component';
import { AppMaterialmoduleModule } from './app-materialmodule.module';
import { AppRoutingModule } from './app-routing.module';

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
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AppMaterialmoduleModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
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
