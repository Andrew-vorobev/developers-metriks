import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { UserRoutingModule } from './user-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { SkeletonDirective } from '../../shared/skeleton/skeleton.directive';
import { UserSearchComponent } from './user-search/user-search.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserComponent,
    UserSearchComponent,
    HomeComponent,
    WelcomeComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SkeletonDirective,
    ReactiveFormsModule,
    NgOptimizedImage
  ]
})
export class UserModule {}
