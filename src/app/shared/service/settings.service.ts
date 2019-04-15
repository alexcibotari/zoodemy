import {Injectable} from '@angular/core';
import {OsUtil} from '../../core/os.util';
import {Settings} from '../model/settings.model';
import {VideoQuality} from '../model/video-quality.model';

@Injectable()
export class SettingsService {

  private readonly SETTINGS_KEY: string = 'settings';
  private readonly APP_HOME_PATH_DEFAULT: string = `${OsUtil.getHomePath()}/zoodemy`;
  private settings: Settings;

  constructor() {
    this.settings = JSON.parse(localStorage.getItem(this.SETTINGS_KEY));
  }

  getDownloadPath(): string {
    if (this.settings && this.settings.downloadPath) {
      return this.settings.downloadPath;
    } else {
      return this.APP_HOME_PATH_DEFAULT;
    }
  }

  getIncludeInstructorInPath(): boolean {
    if (this.settings && this.settings.includeInstructorInPath) {
      return this.settings.includeInstructorInPath;
    } else {
      return false;
    }
  }

  getVideoQuality(): VideoQuality {
    if (this.settings && this.settings.videoQuality) {
      return this.settings.videoQuality;
    } else {
      return VideoQuality.AUTO;
    }
  }

  getDownloadAttachments(): boolean {
    if (this.settings && this.settings.downloadAttachments) {
      return this.settings.downloadAttachments;
    } else {
      return true;
    }
  }

  getDownloadSubtitles(): boolean {
    if (this.settings && this.settings.downloadSubtitles) {
      return this.settings.downloadSubtitles;
    } else {
      return true;
    }
  }

  setSettings(settings: Settings): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    this.settings = settings;
  }

}
