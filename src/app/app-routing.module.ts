import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from './notfound/notfound.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'static',
    loadChildren: () =>
      import('./statistics/statistics.module').then(m => m.StatisticsModule),
  },
  {
    path: 'compare',
    loadChildren: () =>
      import('./modules/compare/compare.module').then(m => m.CompareModule),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./modules/user/user.module').then(m => m.UserModule),
  },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
