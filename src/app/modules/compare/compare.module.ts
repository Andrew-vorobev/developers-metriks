import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { CompareRoutingModule } from './compare-routing.module';
import { CompareComponent } from './compare/compare.component';
import { CompareSearchComponent } from './compare-search/compare-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchListComponent } from './search-list/search-list.component';
import { CompareListComponent } from './compare-list/compare-list.component';
import { CompareUserComponent } from './compare-user/compare-user.component';
import { WeekdayPipe } from '../../shared/pipes/weekday.pipe';

@NgModule({
  declarations: [
    CompareComponent,
    CompareSearchComponent,
    SearchListComponent,
    CompareListComponent,
    CompareUserComponent,
  ],
  imports: [
    CommonModule,
    CompareRoutingModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    WeekdayPipe,
  ],
})
export class CompareModule {}
