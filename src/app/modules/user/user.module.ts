import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { UserRoutingModule } from './user-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { SkeletonDirective } from '../../shared/skeleton/skeleton.directive';

@NgModule({
  declarations: [UserComponent, HomeComponent, WelcomeComponent],
  imports: [CommonModule, UserRoutingModule, SkeletonDirective],
})
export class UserModule {}
