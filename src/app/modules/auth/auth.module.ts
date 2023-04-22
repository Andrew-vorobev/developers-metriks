import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginPreviewComponent } from './login-preview/login-preview.component';
import { SkeletonDirective } from '../../shared/skeleton/skeleton.directive';
import { SkeletonRectComponent } from '../../shared/skeleton/skeleton-rect/skeleton-rect.component';

@NgModule({
  declarations: [LoginFormComponent, LoginPreviewComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SkeletonDirective,
    SkeletonRectComponent,
  ],
})
export class AuthModule {}
