import {VideoQuality} from './video-quality.model';

export class Settings {
  downloadPath: string;
  includeInstructorInPath: boolean = false;
  downloadAttachments: boolean = true;
  downloadSubtitles: boolean = true;
  videoQuality: VideoQuality = VideoQuality.AUTO;
}
