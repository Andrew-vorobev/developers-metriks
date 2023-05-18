import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { CompareRoutingModule } from './compare-routing.module';
import { CompareComponent } from './compare/compare.component';
import { CompareSearchComponent } from './compare-search/compare-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchListComponent } from './search-list/search-list.component';
import { CompareListComponent } from './compare-list/compare-list.component';

@NgModule({
  declarations: [
    CompareComponent,
    CompareSearchComponent,
    SearchListComponent,
    CompareListComponent,
  ],
  imports: [
    CommonModule,
    CompareRoutingModule,
    ReactiveFormsModule,
    NgOptimizedImage,
  ],
})
export class CompareModule {}
