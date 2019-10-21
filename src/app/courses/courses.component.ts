import {Component, OnInit} from '@angular/core';
import {UdemyService} from '../shared/service/udemy.service';
import {Course} from '../shared/model/course.model';
import {CourseDownloadProgress} from '../shared/model/course-download-progress.model';
import {CourseMetadata} from '../shared/model/course-metadata.model';
import {User} from '../shared/model/user.model';

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
  search: string = '';
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
    this.udemyService.getSubscribedCoursesRecursive(this.isArchived)
    .subscribe(value => {
      this.courses  = value;
      this.loading = false;
    });
  }

  download(id: number, title: string, imageUrl: string, instructors: User[]): void {
    this.progress = new CourseDownloadProgress(id, title, imageUrl, instructors);
    this.udemyService.downloadCourse(id, title, imageUrl, instructors)
    .subscribe(value => {
      console.log(value);
      this.progress.progress = value;
    });
  }

  getCourseMetadata(title: string, instructors: User[]): CourseMetadata {
    return this.udemyService.getCourseMetadata(this.udemyService.getCoursePath(title, instructors));
  }

}
