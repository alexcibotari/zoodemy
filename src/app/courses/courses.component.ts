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

  download(id: number, title: string, imageUrl: string): void {
    this.progress = new CourseDownloadProgress(id, title, imageUrl);
    this.udemyService.downloadCourse(id, title)
    .subscribe(value => {
      this.progress.progress = value;
    });
  }

}
