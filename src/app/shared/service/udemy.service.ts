import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Result} from '../model/result.model';
import {Course} from '../model/course.model';
import {BehaviorSubject, EMPTY, Observable} from 'rxjs';
import {CourseBlock} from '../model/course-block.model';
import {Lecture} from '../model/lecture.model';
import {ElectronService} from 'ngx-electron';
import * as sanitize from 'sanitize-filename';
import {AssetType} from '../model/asset-type.model';
import {concatMap, filter, map, switchMap} from 'rxjs/operators';

interface CourseDownloadMetadata {
  courseId: number;
  lectureId: number;
  dir: string;
  lectureIdx: number;
}

interface LectureFileMetadata {
  path: string;
  data: ArrayBuffer;
}

@Injectable()
export class UdemyService {
  private readonly authHeaders: HttpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${this.auth.getToken()}`
  });
  private readonly downloadHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': `application/octet-stream`
  });
  private readonly PATH: string = 'C:/Users/alexa/Downloads/';
  private readonly fs: any = this.electronService.remote.require('fs');

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
        `https://${this.auth.getSubDomain()}.udemy.com/api-2.0/courses/${id}/cached-subscriber-curriculum-items?page_size=100000&fields[lecture]=@default,object_index,supplementary_assets`,
        {
          headers: this.authHeaders
        }
    );
  }

  getLecture(courseId: number, lectureId: number): Observable<Lecture> {
    return this.http.get<Lecture>(`https://${this.auth.getSubDomain()}.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/lectures/${lectureId}?fields[asset]=@default,stream_urls,download_urls,captions,title,filename,data,body&fields[lecture]=@default,asset,supplementary_assets`,
        {
          headers: this.authHeaders
        });
  }

  downloadLecture(courseId: number, lectureId: number, dir: string, lectureIdx: number): Observable<LectureFileMetadata> {
    return this.getLecture(courseId, lectureId)
    .pipe(
        switchMap((lecture: Lecture) => {
          if (lecture.asset.asset_type === AssetType.VIDEO) {
            const extIdx: number = lecture.asset.filename.lastIndexOf('.');
            const ext: string = lecture.asset.filename.slice(extIdx, lecture.asset.filename.length);
            const filePath: string = `${dir}/${this.numberOptimization(lectureIdx)} - ${sanitize(lecture.title)}${ext}`;
            const fileUrl: string = lecture.asset.download_urls.Video[0].file;
            return this.http.get(fileUrl,
                {
                  headers: this.downloadHeaders,
                  reportProgress: true,
                  responseType: 'arraybuffer',
                  // observe: 'events'
                  observe: 'response'
                })
            .pipe(
                map(value => {
                  return <LectureFileMetadata>{
                    path: filePath,
                    data: value.body
                  };
                })
            );
          }
          return EMPTY;
        })
    );
  }

  downloadFile(path: string, url: string): void {
    this.http.get(url,
        {
          headers: this.downloadHeaders,
          reportProgress: true,
          responseType: 'arraybuffer',
          // observe: 'events'
          observe: 'response'
        })
    .subscribe(value => {
          console.log(`Download file : ${path}`);
          this.fs.writeFile(path, new Uint8Array(value.body), () => {
          });
        }
    );

  }

  downloadCourse(id: number, dirName: string): void {
    const downloadList: BehaviorSubject<CourseDownloadMetadata> = new BehaviorSubject<CourseDownloadMetadata>(null);
    const courseDir: string = `${this.PATH}${sanitize(dirName)}`;
    if (this.fs.existsSync(courseDir)) {
      console.log(`Directory already exist ${courseDir}`);
    } else {
      this.fs.mkdirSync(courseDir);
      console.log(`Create directory ${courseDir}`);
    }
    this.getCourse(id)
    .subscribe(course => {
      let chapterDir: string;
      let chapterIdx: number = 1;
      let lectureIdx: number = 1;
      course.results.forEach(block => {
            switch (block._class) {
              case 'chapter' :
                chapterDir = `${courseDir}/${this.numberOptimization(chapterIdx++)} - ${sanitize(block.title)}`;
                if (this.fs.existsSync(chapterDir)) {
                  console.log(`Directory already exist ${chapterDir}`);
                } else {
                  this.fs.mkdirSync(chapterDir);
                  console.log(`Create directory ${chapterDir}`);
                }
                lectureIdx = 1;
                break;
              case 'lecture' :
                downloadList.next(<CourseDownloadMetadata>{
                  courseId: id,
                  lectureId: block.id,
                  dir: chapterDir,
                  lectureIdx: lectureIdx++
                });
                // this.downloadLecture(id, block.id, chapterDir, lectureIdx++);
                break;
              case 'quiz' :
                console.log(`\t${block.id} - ${block.title}`);
                break;
            }
          }
      );
    });

    downloadList.asObservable()
    .pipe(
        filter(value => value != null),
        concatMap((value: CourseDownloadMetadata) => {
          return this.downloadLecture(value.courseId, value.lectureId, value.dir, value.lectureIdx);
        })
    )
    .subscribe(value => {
      console.log(`Download lecture : ${value.path}`);
      this.fs.writeFileSync(value.path, new Uint8Array(value.data));
      console.log(`Saved lecture : ${value.path}`);
    });
  }

  private numberOptimization(idx: number): string {
    if (idx >= 0 && idx < 10) {
      return `0${idx}`;
    }
    return idx.toString();
  }
}
