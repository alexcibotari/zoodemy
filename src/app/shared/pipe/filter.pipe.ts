import {Pipe, PipeTransform} from '@angular/core';
import {Course} from '../model/course.model';

@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform {
  transform(items: Course[], filter: string): Course[] {
    if (filter != null || filter !== '') {
      return items.filter(course => {
        return course.title.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) > -1 ||
            course.visible_instructors
            .some(instructor => instructor.display_name.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) > -1);
      });
    }
    return items;
  }
}
