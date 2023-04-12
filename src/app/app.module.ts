import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PopComponent } from './pop/pop.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { GitlabService } from './stats/gitlab.service';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';

@NgModule({
  declarations: [AppComponent, PopComponent, NotfoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot(),
  ],
  providers: [GitlabService],
  bootstrap: [AppComponent],
})
export class AppModule {}
