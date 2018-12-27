import {Component, OnInit} from '@angular/core';
import {UdemyService} from '../shared/service/udemy.service';
import {Course} from '../shared/model/course.model';

@Component({
  selector: 'zc-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses: Array<Course> = [];

  constructor(
      private readonly udemyService: UdemyService
  ) {
  }

  ngOnInit(): void {
    this.udemyService.getSubscribedCourses()
    .subscribe(value => {
      this.courses = value.results;
    });
  }

  download(course: Course): void {
    // this.udemyService.downloadCourse(course.id, course.title);
    console.log(course.title);
    this.udemyService.download();
  }

}
