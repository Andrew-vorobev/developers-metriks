import { Component, Input } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-commits',
  templateUrl: './user-commits.component.html',
  styleUrls: ['./user-commits.component.css'],
})
export class UserCommitsComponent {
  @Input() userService: UserService;
}
