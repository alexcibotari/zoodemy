import {VideoQuality} from './video-quality.model';

export class Settings {
  downloadPath: string;
  downloadAttachments: boolean = true;
  downloadSubtitles: boolean = true;
  videoQuality: VideoQuality = VideoQuality.AUTO;
}
