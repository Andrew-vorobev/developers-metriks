import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PopComponent } from './pop/pop.component';
import { NotfoundComponent } from './notfound/notfound.component';

const routes: Routes = [
  { path: '', component: PopComponent },
  {
    path: 'auth',
    loadChildren: () => import('./autf/aut.module').then(m => m.AutModule),
  },
  {
    path: 'static',
    loadChildren: () =>
      import('./static/static.module').then(m => m.StaticModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'compare',
    loadChildren: () =>
      import('./compare/compare.module').then(m => m.CompareModule),
  },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
