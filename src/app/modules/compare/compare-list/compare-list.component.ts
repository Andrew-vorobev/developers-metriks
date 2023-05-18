import { Component, OnInit } from '@angular/core';
import { CompareService } from '../compare.service';

export interface IUserStat {
  id: number;
  username: string;
  avatar_url: string;
  mostActiveWeekday: number;
  editStats: number[];
  commitsCount: number;
}

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
