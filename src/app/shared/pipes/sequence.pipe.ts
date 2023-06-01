import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sequence', standalone: true })
export class SequencePipe implements PipeTransform {
  transform(sequence: number[] | string[] | Set<string | number>): string {
    if (sequence instanceof Set) {
      return Array.from(sequence.values()).join(', ');
    }
    return sequence.join(', ');
  }
}
