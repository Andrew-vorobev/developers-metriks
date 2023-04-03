import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PopComponent } from './pop/pop.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { HomeModule } from './home/home.module';

@NgModule({
  declarations: [AppComponent, PopComponent, NotfoundComponent],
  imports: [BrowserModule, AppRoutingModule, HomeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
