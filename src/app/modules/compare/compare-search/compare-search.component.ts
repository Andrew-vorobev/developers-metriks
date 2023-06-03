import { Component, OnInit } from '@angular/core';
import { CompareService } from '../compare.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-compare-search',
  templateUrl: './compare-search.component.html',
})
export class CompareSearchComponent implements OnInit {
  form!: FormGroup;
  constructor(private compareService: CompareService) {}

  ngOnInit() {
    this.form = new FormGroup({
      search: new FormControl<string>('', Validators.required),
    });
  }

  submit() {
    this.compareService.findSearchUsers(this.form.value as { search: string });
  }
}
