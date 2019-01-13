import {Component, OnInit} from '@angular/core';
import {UdemyService} from '../shared/service/udemy.service';
import {Course} from '../shared/model/course.model';
import {CourseDownloadProgress} from '../shared/model/course-download-progress.model';
import {CourseMetadata} from '../shared/model/course-metadata.model';

@Component({
  selector: 'zd-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  loading: boolean = true;
  isArchived: boolean = false;
  courses: Array<Course> = [];
  progress: CourseDownloadProgress;

  constructor(
      private readonly udemyService: UdemyService
  ) {
  }

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.loading = true;
    this.courses = [];
    this.udemyService.getSubscribedCourses(this.isArchived)
    .subscribe(value => {
      this.loading = false;
      this.courses = value.results;
    });
  }

  download(id: number, title: string, imageUrl: string): void {
    this.progress = new CourseDownloadProgress(id, title, imageUrl);
    this.udemyService.downloadCourse(id, title, imageUrl)
    .subscribe(value => {
      console.log(value);
      this.progress.progress = value;
    });
  }

  getCourseMetadata(title: string): CourseMetadata {
    return this.udemyService.getCourseMetadata(title);
  }

}
