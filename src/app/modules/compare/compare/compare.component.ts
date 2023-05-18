import { Component } from '@angular/core';
import { CompareService } from '../compare.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css'],
})
export class CompareComponent {
  constructor(protected compareService: CompareService) {}
}
