import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './main/main.component';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from './core/auth.guard';
import {CoursesComponent} from './courses/courses.component';
import {CourseDetailComponent} from './course-detail/course-detail.component';
import {SettingsComponent} from './settings/settings.component';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'courses',
        component: CoursesComponent
      },
      {
        path: 'courses/:id',
        component: CourseDetailComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
