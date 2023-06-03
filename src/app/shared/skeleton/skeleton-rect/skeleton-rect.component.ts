import { Component, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-skeleton-rect',
  templateUrl: './skeleton-rect.component.html',
  styleUrls: ['./skeleton-rect.component.css'],
  imports: [NgStyle, NgClass],
})
export class SkeletonRectComponent {
  @Input() height: string;
  @Input() width: string;
  @Input() isRound: string;
  @Input() classes = '';
}
