import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css'],
})
export class UserSearchComponent implements OnInit {
  protected form!: FormGroup;
  // constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      search: new FormControl<string>('', Validators.required),
    });
  }

  protected submit(): void {
    console.log('Okay');
  }
}
