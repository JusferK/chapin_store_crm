import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainFrameComponent } from './view/private/main-frame/main-frame.component';
import { LoginComponent } from './view/public/login/login.component';
import { NotLoggedGuard } from './guards/not-logged.guard';
import { LoggedGuard } from './guards/logged.guard';

const routes: Routes = [
  {
    path: '',
    component: MainFrameComponent,
    canActivate: [LoggedGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotLoggedGuard],
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
