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
import {concatMap, filter, flatMap, map, retryWhen, tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../../environments/environment';
import {WriteStream} from 'fs';
import {SettingsService} from './settings.service';
import {DownloadProgress} from '../model/download-progress.model';
import {FileMetadata} from '../model/file-metadata.model';
import {VideoQuality} from '../model/video-quality.model';
import {CourseMetadata} from '../model/course-metadata.model';

class AssetDownloadable {
  constructor(
      public main: DownloadableAssetMetadata,
      public assets: DownloadableAssetMetadata[] = []
  ) {

  }

}

class DownloadableAssetMetadata {
  constructor(
      public url: string,
      public path: string
  ) {

  }
}

class AssetMetadata<T> {
  constructor(
      public path: string,
      public data: T
  ) {

  }
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
        // tslint:disable-next-line
        `https://${this.auth.getSubDomain()}.udemy.com/api-2.0/users/me/subscribed-courses?page_size=100&fields[course]=@default,completion_ratio,visible_instructors`,
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

  downloadAsset(url: string, path: string): Observable<AssetMetadata<ArrayBuffer>> {
    return this.http.head(url)
    .pipe(
        flatMap(() => {
          return this.http.get(url,
              {
                headers: this.downloadHeaders,
                reportProgress: true,
                responseType: 'arraybuffer',
                // observe: 'events'
                observe: 'response'
              })
          .pipe(
              retryWhen(() => {
                return interval(environment.download.interval).pipe(
                    flatMap(count =>
                        count === environment.download.retry ? throwError(`Error during download of ${url} for ${path}`) : of(count))
                );
              }),
              map(value => new AssetMetadata<ArrayBuffer>(path, value.body))
          );
        })
    );

  }

  downloadArticle(courseId: number, lectureId: number, path: string, lectureIdx: number): Observable<AssetMetadata<String>> {
    return this.getLecture(courseId, lectureId)
    .pipe(
        map((lecture: Lecture) => {
          return <AssetMetadata<String>>{
            path: `${path}/${this.numberOptimization(lectureIdx)} - ${sanitize(lecture.title)}.html`,
            data: lecture.asset.body
          };
        }),
    );
  }

  getVideoDownloadable(courseId: number, lectureId: number, path: string, lectureIdx: number): Observable<AssetDownloadable> {
    return this.getLecture(courseId, lectureId)
    .pipe(
        map((lecture: Lecture) => {
          let filePath: string = `${path}/${this.numberOptimization(lectureIdx)} - ${sanitize(lecture.title)}`;
          const extIdx: number = lecture.asset.filename.lastIndexOf('.');
          const ext: string = lecture.asset.filename.slice(extIdx, lecture.asset.filename.length);
          const fileUrl: string = this.selectVideo(lecture.asset.download_urls.Video).file;
          filePath = `${filePath}${ext}`;
          const downloadable: AssetDownloadable = new AssetDownloadable(new DownloadableAssetMetadata(fileUrl, filePath));
          if (lecture.supplementary_assets && lecture.supplementary_assets.length > 0) {
            lecture.supplementary_assets.forEach(asset => {
              if (asset.asset_type === AssetType.FILE) {
                downloadable.assets.push(new DownloadableAssetMetadata(
                    asset.download_urls.File[0].file,
                    `${path}/${this.numberOptimization(lectureIdx)} - ${sanitize(asset.title)}`
                ));
              } else {
                console.log('Unknown supplementary_assets');
                console.log(asset);
              }
            });
          }
          return downloadable;
        }),
    );
  }

  getEBookDownloadable(courseId: number, lectureId: number, path: string, lectureIdx: number): Observable<AssetDownloadable> {
    return this.getLecture(courseId, lectureId)
    .pipe(
        map((lecture: Lecture) => {
          const filePath: string = `${path}/${this.numberOptimization(lectureIdx)} - ${sanitize(lecture.asset.title)}`;
          const fileUrl: string = lecture.asset.download_urls['E-Book'][0].file;
          return new AssetDownloadable(new DownloadableAssetMetadata(fileUrl, filePath));
        }),
    );
  }

  downloadCourse(id: number, title: string, imageUrl: string): Observable<DownloadProgress> {
    let totalFiles: number = 0;
    let currentFile: number = 0;
    const downloadProgress: BehaviorSubject<DownloadProgress> = new BehaviorSubject<DownloadProgress>(null);
    const downloadSaveAssets: BehaviorSubject<DownloadableAssetMetadata> = new BehaviorSubject<DownloadableAssetMetadata>(null);
    const saveArticles: BehaviorSubject<AssetMetadata<String>> = new BehaviorSubject<AssetMetadata<String>>(null);
    const coursePath: string = this.getCoursePath(title);
    if (this.fs.existsSync(coursePath)) {
      console.log(`Directory already exist ${coursePath}`);
    } else {
      this.fs.mkdirSync(coursePath);
      console.log(`Create directory ${coursePath}`);
    }
    if (imageUrl !== null) {
      totalFiles++;
      const extIdx: number = imageUrl.lastIndexOf('.');
      const ext: string = imageUrl.slice(extIdx, imageUrl.length);
      downloadSaveAssets.next(new DownloadableAssetMetadata(imageUrl, `${coursePath}/logo${ext}`));
    }
    this.getCourse(id)
    .subscribe(course => {
      let chapterPath: string;
      let chapterIdx: number = 1;
      let lectureIdx: number = 1;
      if (course.results[0]._class === 'lecture') {
        chapterPath = `${coursePath}/${this.numberOptimization(chapterIdx++)} - ${sanitize('Course Introduction')}`;
        if (!this.fs.existsSync(chapterPath)) {
          this.fs.mkdirSync(chapterPath);
        }
      }
      course.results.forEach((block) => {
            switch (block._class) {
              case 'chapter' :
                chapterPath = `${coursePath}/${this.numberOptimization(chapterIdx++)} - ${sanitize(block.title)}`;
                if (!this.fs.existsSync(chapterPath)) {
                  this.fs.mkdirSync(chapterPath);
                }
                lectureIdx = 1;
                break;
              case 'lecture' :
                const lecture: Lecture = block as Lecture;
                if (lecture.asset.asset_type === AssetType.VIDEO) {
                  totalFiles++;
                  if (lecture.supplementary_assets && lecture.supplementary_assets.length > 0) {
                    lecture.supplementary_assets
                    .filter(value => value.asset_type === AssetType.FILE)
                    .forEach(() => totalFiles++);
                  }
                  this.getVideoDownloadable(id, lecture.id, chapterPath, lectureIdx++)
                  .subscribe(value => {
                    if (value.main) {
                      downloadSaveAssets.next(value.main);
                      value.assets.forEach(asset => downloadSaveAssets.next(asset));
                    }
                  });
                } else if (lecture.asset.asset_type === AssetType.E_BOOK) {
                  totalFiles++;
                  this.getEBookDownloadable(id, lecture.id, chapterPath, lectureIdx++)
                  .subscribe(value => {
                    if (value.main) {
                      downloadSaveAssets.next(value.main);
                    }
                  });
                } else if (lecture.asset.asset_type === AssetType.ARTICLE) {
                  totalFiles++;
                  this.downloadArticle(id, lecture.id, chapterPath, lectureIdx++)
                  .subscribe(value => saveArticles.next(value));
                } else {
                  console.log('unknown lecture');
                  console.log(lecture);
                }

                break;
              case 'quiz' :
                console.log(`\t${block.id} - ${block.title}`);
                break;
            }
          }
      );
      downloadProgress.next(new DownloadProgress(totalFiles, currentFile));
    });
    // Save Articles
    saveArticles.asObservable()
    .pipe(
        filter(value => value != null)
    )
    .subscribe(value => {
      if (this.fs.existsSync(value.path)) {
        console.log(`File already exist : ${value.path}`);
      } else {
        this.fs.writeFileSync(value.path, value.data);
        console.log(`Saved lecture : ${value.path}`);
      }
      downloadProgress.next(new DownloadProgress(totalFiles, ++currentFile));
    });
    // Download and Save Assets
    downloadSaveAssets.asObservable()
    .pipe(
        filter(value => value != null),
        concatMap((value: DownloadableAssetMetadata) => {
          if (this.fs.existsSync(value.path)) {
            console.log(`File already exist : ${value.path}`);
            downloadProgress.next(new DownloadProgress(totalFiles, ++currentFile));
            return EMPTY;
          } else {
            return this.downloadAsset(value.url, value.path);
          }
        })
    )
    .subscribe((value: AssetMetadata<ArrayBuffer>) => {
          console.log(`Download lecture : ${value.path}`);
          const step: number = 1024 * 1024;
          const iterations: number = value.data.byteLength / step;
          let minIdx: number = 0;
          let maxIdx: number = step;
          const writeStream: WriteStream = this.fs.createWriteStream(value.path);
          for (let i: number = 0; i <= iterations; i++) {
            writeStream.write(Buffer.from(value.data.slice(minIdx, maxIdx)));
            minIdx = minIdx + step;
            maxIdx = maxIdx + step;
          }
          if (maxIdx < value.data.byteLength - 1) {
            writeStream.write(Buffer.from(value.data.slice(maxIdx)));
          }
          writeStream.on('finish', () => {
            console.log(`Saved lecture : ${value.path}`);
          });
          writeStream.end();
          downloadProgress.next(new DownloadProgress(totalFiles, ++currentFile));
        },
        (error) => {
          console.log(`'${title}' Error during downloading.`);
          console.log(error);
          this.snackBar.open(
              `'${title}' Error during downloading.`,
              'Close'
          );
          downloadProgress.next(new DownloadProgress(totalFiles, currentFile, true));
          this.saveCourseMetadata(title, {complete: false});
        },
        () => {
          console.log(`'${title}' Download completed.`);
          this.snackBar.open(
              `'${title}' Download completed.`,
              'Close'
          );
          this.saveCourseMetadata(title, {complete: true});
        });
    return downloadProgress.asObservable()
    .pipe(
        filter(value => value != null),
        tap(next => {
          // skip logo file
          if (next.totalFiles > 1 && next.isDone) {
            downloadSaveAssets.complete();
            saveArticles.complete();
          }
        })
    );
  }

  private numberOptimization(idx: number): string {
    if (idx >= 0 && idx < 10) {
      return `0${idx}`;
    }
    return idx.toString();
  }

  private getCoursePath(title: string): string {
    return `${this.settingsService.getDownloadPath()}/${sanitize(title)}`;
  }

  getCourseMetadata(title: string): CourseMetadata | null {
    const metadataPath: string = `${this.getCoursePath(title)}/metadata.json`;
    if (this.fs.existsSync(metadataPath)) {
      return JSON.parse(this.fs.readFileSync(metadataPath));
    }
    return null;
  }

  saveCourseMetadata(title: string, metadata: CourseMetadata): void {
    const metadataPath: string = `${this.getCoursePath(title)}/metadata.json`;
    this.fs.writeFileSync(metadataPath, JSON.stringify(metadata));
  }
}
