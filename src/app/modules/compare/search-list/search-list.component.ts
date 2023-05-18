import { Component } from '@angular/core';
import { CompareService } from '../compare.service';
import { UserDto } from '../../../statistics/dto/user.dto';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
})
export class SearchListComponent {
  constructor(protected compareService: CompareService) {}

  addUserToCompare(user: UserDto) {
    this.compareService.addUserToCompare(user);
  }
}
