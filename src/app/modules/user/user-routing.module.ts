import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserComponent } from './user/user.component';
import { WelcomeGuard } from '../../shared/guards/welcome.guard';
import { AuthGuard } from '../../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/:id',
    component: UserComponent,
    canActivate: [AuthGuard],
  },
  { path: 'welcome', component: WelcomeComponent, canActivate: [WelcomeGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
