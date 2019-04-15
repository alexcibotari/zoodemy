import {DownloadProgress} from './download-progress.model';
import {User} from './user.model';

export class CourseDownloadProgress {
  constructor(
      public id: number,
      public title: string,
      public image: string,
      public instructors: User[],
      public progress?: DownloadProgress
  ) {

  }
}
