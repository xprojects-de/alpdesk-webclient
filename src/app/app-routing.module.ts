import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { CustomContainerComponent } from './plugins/customcontainer/custom-container/custom-container.component';
import { HelloComponent } from './plugins/hello/hello.component';
import { JiraComponent } from './plugins/jiracontainer/jira/jira.component';
import { OfferComponent } from './plugins/offer/offer.component';
import { FinderComponent } from './plugins/finder/finder.component';
import { AutomationComponent } from './plugins/automationcontainer/automation/automation.component';


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

@NgModule({
  imports: [RouterModule.forRoot(
    appRoutes,
      {
    enableTracing: false,
    onSameUrlNavigation: 'reload',
    relativeLinkResolution: 'legacy'
}
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
