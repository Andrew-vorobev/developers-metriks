import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { SkeletonRectComponent } from './skeleton-rect/skeleton-rect.component';

@Directive({
  selector: '[appSkeleton]',
  standalone: true,
})
export class SkeletonDirective implements OnChanges {
  @Input('appSkeleton') isLoading = false;
  @Input('appSkeletonWidth') width: string;
  @Input('appSkeletonHeight') height: string;
  @Input('appSkeletonIsRound') isRound = false;
  @Input('appSkeletonClasses') classes: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private ViewContainerRef: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLoading']) {
      this.ViewContainerRef.clear();
      if (changes['isLoading']?.currentValue) {
        const ref = this.ViewContainerRef.createComponent(
          SkeletonRectComponent
        );

        Object.assign(ref.instance, {
          width: this.width,
          height: this.height,
          isRound: this.isRound,
          classes: this.classes,
        });
      } else {
        this.ViewContainerRef.createEmbeddedView(this.templateRef);
      }
    }
  }
}
