import {DownloadProgress} from './download-progress.model';

export class CourseDownloadProgress {
  constructor(
      public id: number,
      public title: string,
      public image: string,
      public progress?: DownloadProgress
  ) {

  }
}
