import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Result} from '../model/result.model';
import {Course} from '../model/course.model';
import {Observable} from 'rxjs';
import {CourseBlock} from '../model/course-block.model';
import {Lecture} from '../model/lecture.model';
import {ElectronService} from 'ngx-electron';
import * as sanitize from 'sanitize-filename';

@Injectable()
export class UdemyService {
  private readonly authHeaders: HttpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${this.auth.getToken()}`
  });
  private readonly downloadHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': `application/octet-stream`
  });
  private readonly PATH: string = 'C:/Users/alexa/Downloads/';

  constructor(
      private readonly http: HttpClient,
      private readonly auth: AuthService,
      private electronService: ElectronService
  ) {
  }

  getSubscribedCourses(): Observable<Result<Course>> {
    return this.http.get<Result<Course>>(
        `https://${this.auth.getSubDomain()}.udemy.com/api-2.0/users/me/subscribed-courses?page_size=50`,
        {
          headers: this.authHeaders
        }
    );
  }

  getCourse(id: number): Observable<Result<CourseBlock>> {
    return this.http.get<Result<CourseBlock>>(
        `https://${this.auth.getSubDomain()}.udemy.com/api-2.0/courses/${id}/cached-subscriber-curriculum-items?page_size=100000
        &fields[lecture]=@default,object_index,supplementary_assets`,
        {
          headers: this.authHeaders
        }
    );
  }

  getLecture(courseId: number, lectureId: number): Observable<Lecture> {
    return this.http.get<Lecture>(`https://${this.auth.getSubDomain()}.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/lectures/
    ${lectureId}?fields[asset]=stream_urls,download_urls,captions,title,filename,data,body&fields[lecture]=asset,supplementary_assets`,
        {
          headers: this.authHeaders
        });
  }

  download(): void {
    this.http.get('123',
        {
          headers: this.downloadHeaders,
          reportProgress: true,
          responseType: 'arraybuffer',
          observe: 'events'
          // observe: 'response'
        })
    .subscribe(value => {
          console.log(value);
        }
    );

  }

  downloadCourse(id: number, dirName: string): void {
    const fs: any = this.electronService.remote.require('fs');
    const courseDir: string = `${this.PATH}${sanitize(dirName)}`;
    if (fs.existsSync(courseDir)) {
      console.log('Directory already exist');
    } else {
      fs.mkdirSync(courseDir);
      console.log(`Create directory : ${courseDir}`);
      this.getCourse(id)
      .subscribe(course => {
        let chapterDir: string;
        let chapterIdx: number = 1;
        course.results.forEach(block => {
              switch (block._class) {
                case 'chapter' :
                  chapterDir = `${courseDir}/${this.numberOptimization(chapterIdx++)} - ${sanitize(block.title)}`;
                  fs.mkdirSync(chapterDir);
                  console.log(`Create directory : ${chapterDir}`);
                  console.log(`${block.id} - ${block.title}`);
                  break;
                case 'lecture' :
                  this.getLecture(id, block.id)
                  .subscribe(value => {
                    const fileUrl: string = value.asset.download_urls.Video[0].file;
                    this.http.get(fileUrl)
                    .subscribe(value1 => {
                      console.log(value1);
                    });
                  });
                  console.log(`\t${block.id} - ${block.title}`);
                  break;
                case 'quiz' :
                  console.log(`\t${block.id} - ${block.title}`);
                  break;
              }
            }
        );
      });
    }
  }

  private numberOptimization(idx: number): string {
    if (idx >= 0 && idx < 10) {
      return `0${idx}`;
    }
    return idx.toString();
  }
}
