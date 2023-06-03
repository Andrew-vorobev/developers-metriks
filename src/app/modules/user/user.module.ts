import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { UserRoutingModule } from './user-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { SkeletonDirective } from '../../shared/skeleton/skeleton.directive';
import { UserSearchComponent } from './user-search/user-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LetDirective } from '../../shared/let.directive';
import { WeekdayPipe } from '../../shared/pipes/weekday.pipe';
import { SequencePipe } from '../../shared/pipes/sequence.pipe';
import { UserDataComponent } from './user-data/user-data.component';
import { UserStatsComponent } from './user-stats/user-stats.component';
import { UserProjectsComponent } from './user-projects/user-projects.component';
import { UserCommitsComponent } from './user-commits/user-commits.component';

@NgModule({
  declarations: [
    UserComponent,
    UserSearchComponent,
    HomeComponent,
    WelcomeComponent,
    UserDataComponent,
    UserStatsComponent,
    UserProjectsComponent,
    UserCommitsComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SkeletonDirective,
    ReactiveFormsModule,
    NgOptimizedImage,
    LetDirective,
    WeekdayPipe,
    SequencePipe,
  ],
})
export class UserModule {}
