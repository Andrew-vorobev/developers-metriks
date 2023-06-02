import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private _subs: Subscription[];

  constructor(
    private _activateRoute: ActivatedRoute,
    protected userService: UserService
  ) {
    this._subs = [];
  }

  ngOnInit() {
    this._subs.push(
      this._activateRoute.params
        .pipe(map(params => params['id']))
        .subscribe(userNameId => this.userService.updateUserData(true))
    );
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }
}
