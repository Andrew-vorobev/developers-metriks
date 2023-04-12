import { Component } from '@angular/core';
import { UserExtraDto } from '../../../stats/dto/userExtra.dto';
import { GitlabService } from '../../../stats/gitlab.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  protected data: UserExtraDto;
  protected isLoaded = false;
  constructor(private gitlabService: GitlabService) {
    gitlabService
      .getProfileData()
      .pipe(
        tap(el => {
          console.log(el);
        })
      )
      .subscribe(el => {
        this.isLoaded = true;
        this.data = el;
      });
  }
}
