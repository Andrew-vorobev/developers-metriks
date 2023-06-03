import { Component, Input } from '@angular/core';
import { IUserStat } from '../../../shared/interfaces/user-stat.interface';
import { CompareService } from '../compare.service';

@Component({
  selector: 'app-compare-user',
  templateUrl: './compare-user.component.html',
})
export class CompareUserComponent {
  @Input() userData: IUserStat;

  constructor(private compareService: CompareService) {}

  deleteUser(id: number) {
    this.compareService.deleteUser(id);
    console.log(id);
  }
}
