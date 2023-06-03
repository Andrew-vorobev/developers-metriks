import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css'],
})
export class UserSearchComponent implements OnInit {
  protected isLoading = false;
  protected form!: FormGroup;

  constructor(private _router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      id: new FormControl<string>('', Validators.required),
    });
  }

  protected onSubmit(): void {
    this._router.navigate(['/users/user', this.form.value.id]);
  }
}
