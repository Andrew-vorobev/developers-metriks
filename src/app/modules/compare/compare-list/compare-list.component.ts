import { Component, OnInit } from '@angular/core';
import { CompareService } from '../compare.service';
import { IUserStat } from '../../../shared/interfaces/user-stat.interface';

@Component({
  selector: 'app-compare-list',
  templateUrl: './compare-list.component.html',
})
export class CompareListComponent implements OnInit {
  userStats!: IUserStat[];
  constructor(protected compareService: CompareService) {}

  ngOnInit() {
    this.compareService.userStats$.subscribe(users => {
      this.userStats = users;
    });
  }
}
