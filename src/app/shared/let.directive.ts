import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface LetContext<T> {
  appLet: T | null;
}

@Directive({
  selector: '[appLet]',
  standalone: true,
})
export class LetDirective<T> {
  private _context: LetContext<T> = { appLet: null };

  constructor(
    private _viewContainer: ViewContainerRef,
    private _templateRef: TemplateRef<LetContext<T>>
  ) {
    _viewContainer.createEmbeddedView(_templateRef, this._context);
  }

  @Input()
  set appLet(value: T) {
    this._context.appLet = value;
  }
}
// import { Directive, Input, OnDestroy } from '@angular/core';
// import { distinctUntilChanged, Observable, Subscription } from 'rxjs';
//
// export interface LetViewContext<T> {
//   $implicit: T | undefined;
//   $error: Error | undefined;
//   $complete: boolean;
//   appLet: T | undefined;
// }
//
// @Directive({
//   selector: '[appLet]',
//   standalone: true,
// })
// export class LetDirective<T> implements OnDestroy {
//   private readonly viewContext: LetViewContext<T> = {
//     $implicit: undefined,
//     appLet: undefined,
//     $error: undefined,
//     $complete: false,
//   };
//   private subscription = new Subscription();
//   private sourceObservable: Observable<T>;
//
//   @Input()
//   set appLet(sourceObservable: Observable<T>) {
//     this.subscription.unsubscribe();
//     this.sourceObservable = sourceObservable.pipe(distinctUntilChanged());
//     this.subscription = this.sourceObservable.subscribe();
//   }
//
//   ngOnDestroy(): void {
//     this.subscription.unsubscribe();
//   }
// }
