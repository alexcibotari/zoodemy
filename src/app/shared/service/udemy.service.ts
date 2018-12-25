import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Result} from '../model/result.model';
import {Course} from '../model/course.model';
import {Observable} from 'rxjs';
import {CourseBlock} from '../model/course-block.model';
import {Lecture} from '../model/lecture.model';

@Injectable()
export class UdemyService {
  private readonly headers: HttpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${this.auth.getToken()}`
  });
  // private readonly PATH: string = 'C:\\Users\\alexa\\Downloads\\';

  constructor(
      private readonly http: HttpClient,
      private readonly auth: AuthService
  ) {
  }

  getSubscribedCourses(): Observable<Result<Course>> {
    return this.http.get<Result<Course>>(
        `https://${this.auth.getSubDomain()}.udemy.com/api-2.0/users/me/subscribed-courses?page_size=50`,
        {
          headers: this.headers
        }
    );
  }

  getCourse(id: number): Observable<Result<CourseBlock>> {
    return this.http.get<Result<CourseBlock>>(
        `https://${this.auth.getSubDomain()}.udemy.com/api-2.0/courses/${id}/cached-subscriber-curriculum-items?page_size=100000
        &fields[lecture]=@default,object_index,supplementary_assets`,
        {
          headers: this.headers
        }
    );
  }

  getLecture(courseId: number, lectureId: number): Observable<Lecture> {
    return this.http.get<Lecture>(`https://${this.auth.getSubDomain()}.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/lectures/
    ${lectureId}?fields[asset]=stream_urls,download_urls,captions,title,filename,data,body&fields[lecture]=asset,supplementary_assets`,
        {
          headers: this.headers
        });
  }

  /*downloadCourse(id: number, dirName: string): void {
    this.getCourse(id)
    .subscribe(course => {
      const courseDir: string = this.PATH + dirName;
      console.log(existsSync('C:\\Users\\alexa\\Downloads'));
      console.log(existsSync('C:/Users/alexa/Downloads'));
      console.log(existsSync('C:/Users/alexa/Downloads/abc'));
      mkdirp('C:/Users/alexa/Downloads/abc', () => {
        console.log(courseDir);
        console.log('created');
      });
      course.results.forEach(block => {
            console.log(block.id);
          }
      );
    });
  }*/
}
