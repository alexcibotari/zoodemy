import {VideoQuality} from './video-quality.model';

export interface FileMetadata {
  type: string;
  label: VideoQuality;
  file: string;
}
