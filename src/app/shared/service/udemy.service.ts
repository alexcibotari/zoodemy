import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Result} from '../model/result.model';
import {Course} from '../model/course.model';
import {BehaviorSubject, EMPTY, interval, Observable, of, throwError} from 'rxjs';
import {CourseBlock} from '../model/course-block.model';
import {Lecture} from '../model/lecture.model';
import {ElectronService} from 'ngx-electron';
import * as sanitize from 'sanitize-filename';
import {AssetType} from '../model/asset-type.model';
import {concatMap, filter, flatMap, map, retryWhen, switchMap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../../environments/environment';
import {WriteStream} from 'fs';
import {SettingsService} from './settings.service';
import {DownloadProgress} from '../model/download-progress.model';
import {FileMetadata} from '../model/file-metadata.model';
import {VideoQuality} from '../model/video-quality.model';

interface CourseDownloadMetadata {
  courseId: number;
  lectureId: number;
  dir: string;
  lectureIdx: number;
}

interface AssetMetadata {
  path: string;
  data: ArrayBuffer | string;
}

@Injectable()
export class UdemyService {
  private readonly authHeaders: HttpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${this.auth.getToken()}`
  });
  private readonly downloadHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': `application/octet-stream`
  });
  private readonly fs: any = this.electronService.remote.require('fs');

  constructor(
      private readonly http: HttpClient,
      private readonly auth: AuthService,
      private readonly electronService: ElectronService,
      private readonly snackBar: MatSnackBar,
      private readonly settingsService: SettingsService
  ) {
    if (this.fs.existsSync(this.settingsService.getDownloadPath())) {
      console.log(`App home directory already exist.`);
    } else {
      this.fs.mkdirSync(this.settingsService.getDownloadPath());
      console.log(`Create App home directory`);
    }
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
        // tslint:disable-next-line
        `https://${this.auth.getSubDomain()}.udemy.com/api-2.0/courses/${id}/cached-subscriber-curriculum-items?page_size=100000&fields[lecture]=@default,object_index,supplementary_assets`,
        {
          headers: this.authHeaders
        }
    );
  }

  getLecture(courseId: number, lectureId: number): Observable<Lecture> {
    return this.http.get<Lecture>(
        // tslint:disable-next-line
        `https://${this.auth.getSubDomain()}.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/lectures/${lectureId}?fields[asset]=@default,stream_urls,download_urls,captions,title,filename,data,body&fields[lecture]=@default,asset,supplementary_assets`,
        {
          headers: this.authHeaders
        });
  }

  private selectVideo(videos: FileMetadata[]): FileMetadata {
    let result: FileMetadata = videos[0];
    switch (this.settingsService.getVideoQuality()) {
      case VideoQuality.AUTO:
      case VideoQuality.HIGHEST:
        videos.forEach(video => {
          if (+video.label > +result.label) {
            result = video;
          }
        });
        break;
      case VideoQuality.LOWEST:
        videos.forEach(video => {
          if (+video.label < +result.label) {
            result = video;
          }
        });
        break;
      case VideoQuality.H144:
      case VideoQuality.H360:
      case VideoQuality.H480:
      case VideoQuality.H720:
      case VideoQuality.H1080:
        videos.forEach(video => {
          if (+video.label === +this.settingsService.getVideoQuality()) {
            result = video;
          }
        });
        break;
    }
    return result;
  }

  downloadLecture(courseId: number, lectureId: number, dir: string, lectureIdx: number): Observable<AssetMetadata> {
    return this.getLecture(courseId, lectureId)
    .pipe(
        switchMap((lecture: Lecture) => {
          let filePath: string = `${dir}/${this.numberOptimization(lectureIdx)} - ${sanitize(lecture.title)}`;
          if (lecture.asset.asset_type === AssetType.VIDEO) {
            const extIdx: number = lecture.asset.filename.lastIndexOf('.');
            const ext: string = lecture.asset.filename.slice(extIdx, lecture.asset.filename.length);
            const fileUrl: string = this.selectVideo(lecture.asset.download_urls.Video).file;
            filePath = `${filePath}${ext}`;
            if (!this.fs.existsSync(filePath)) {
              return this.http.get(fileUrl,
                  {
                    headers: this.downloadHeaders,
                    reportProgress: true,
                    responseType: 'arraybuffer',
                    // observe: 'events'
                    observe: 'response'
                  })
              .pipe(
                  retryWhen(() => {
                    return interval(5000).pipe(
                        flatMap(count => count === 5 ? throwError('Giving up') : of(count))
                    );
                  }),
                  map(value => {
                    return <AssetMetadata>{
                      path: filePath,
                      data: value.body
                    };
                  })
              );
            } else {
              console.log(`File already exist : ${filePath}`);
            }
          } else if (lecture.asset.asset_type === AssetType.ARTICLE) {
            return of(<AssetMetadata>{
              path: `${filePath}.html`,
              data: lecture.asset.body
            });
          }
          return EMPTY;
        })
    );
  }

  downloadCourse(id: number, dirName: string): Observable<DownloadProgress> {
    let totalFiles: number = 0;
    let currentFile: number = 0;
    const downloadProgress: BehaviorSubject<DownloadProgress> = new BehaviorSubject<DownloadProgress>(null);
    const downloadList: BehaviorSubject<CourseDownloadMetadata> = new BehaviorSubject<CourseDownloadMetadata>(null);
    const courseDir: string = `${this.settingsService.getDownloadPath()}/${sanitize(dirName)}`;
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
                if (!this.fs.existsSync(chapterDir)) {
                  this.fs.mkdirSync(chapterDir);
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
                totalFiles++;
                break;
              case 'quiz' :
                console.log(`\t${block.id} - ${block.title}`);
                break;
            }
          }
      );
      downloadProgress.next(new DownloadProgress(totalFiles));
    });
    downloadList.asObservable()
    .pipe(
        filter(value => value != null),
        concatMap((value: CourseDownloadMetadata) => {
          return this.downloadLecture(value.courseId, value.lectureId, value.dir, value.lectureIdx);
        })
    )
    .subscribe((value: AssetMetadata) => {
          console.log(`Download lecture : ${value.path}`);

          if (value.data instanceof ArrayBuffer) {
            const step: number = 1024 * 1024;
            const iterations: number = value.data.byteLength / step;
            let minIdx: number = 0;
            let maxIdx: number = step;
            const writeStream: WriteStream = this.fs.createWriteStream(value.path);
            for (let i: number = 0; i <= iterations; i++) {
              writeStream.write(new Buffer(value.data.slice(minIdx, maxIdx)));
              minIdx = minIdx + step;
              maxIdx = maxIdx + step;
            }
            if (maxIdx < value.data.byteLength - 1) {
              writeStream.write(new Buffer(value.data.slice(maxIdx)));
            }
            writeStream.on('finish', () => {
              console.log(`Saved lecture : ${value.path}`);
            });
            writeStream.end();
          } else {
            this.fs.writeFileSync(value.path, value.data);
            console.log(`Saved lecture : ${value.path}`);
          }
          downloadProgress.next(new DownloadProgress(totalFiles, ++currentFile));
        },
        (error) => {
          console.log(error);
          this.snackBar.open(
              `Error during downloading.`,
              '',
              {
                duration: environment.message.duration
              }
          );
        },
        () => {
          this.snackBar.open(
              `Download completed.`,
              '',
              {
                duration: environment.message.duration
              }
          );
        });
    return downloadProgress.asObservable()
    .pipe(
        filter(value => value != null)
    );
  }

  private numberOptimization(idx: number): string {
    if (idx >= 0 && idx < 10) {
      return `0${idx}`;
    }
    return idx.toString();
  }
}
