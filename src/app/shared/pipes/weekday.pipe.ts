import { Pipe, PipeTransform } from '@angular/core';

const weekdays: { [index: number]: string } = {
  0: 'Воскресенье',
  1: 'Понедельник',
  2: 'Вторник',
  3: 'Среда',
  4: 'Четверг',
  5: 'Пятница',
  6: 'Суббота',
  7: 'Не определен',
};

@Pipe({ name: 'weekday', standalone: true })
export class WeekdayPipe implements PipeTransform {
  transform(day: number): string {
    return weekdays[day];
  }
}
