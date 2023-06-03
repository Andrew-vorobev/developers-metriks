import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sequence', standalone: true })
export class SequencePipe implements PipeTransform {
  transform(sequence: number[] | string[] | Set<string | number>): string {
    if (sequence instanceof Set) {
      if (sequence.size === 0) return 'Нету';
      return Array.from(sequence.values()).join(', ');
    }
    if (sequence.length === 0) return 'Нету';
    return sequence.join(', ');
  }
}
