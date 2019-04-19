import {Pipe, PipeTransform} from '@angular/core';
import {Course} from '../model/course.model';

@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform {
  transform(items: Course[], filter: string): Course[] {
    if (filter != null || filter !== '') {
      return items.filter(it => it.title.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) > -1);
    }
    return items;
  }
}
