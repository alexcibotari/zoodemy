import {Component, OnInit} from '@angular/core';
import {UdemyService} from '../shared/service/udemy.service';
import {Course} from '../shared/model/course.model';
import {CourseDownloadProgress} from '../shared/model/course-download-progress.model';

@Component({
  selector: 'zd-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses: Array<Course> = [];
  progress: CourseDownloadProgress;

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
    this.progress = new CourseDownloadProgress(course.id, course.title, course.image_240x135);
    this.udemyService.downloadCourse(course.id, course.title)
    .subscribe(value => {
      this.progress.progress = value;
    });
  }

}
