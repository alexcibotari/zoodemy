import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../shared/service/settings.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VideoQuality} from '../shared/model/video-quality.model';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'zd-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  videoQualityList: string[] = Object.keys(VideoQuality);

  settingsForm: FormGroup = new FormGroup({
    downloadPath: new FormControl(this.settingsService.getDownloadPath(), Validators.required),
    includeInstructorInPath: new FormControl(this.settingsService.getIncludeInstructorInPath(), Validators.required),
    downloadAttachments: new FormControl({value: this.settingsService.getDownloadAttachments(), disabled: true}, Validators.required),
    downloadSubtitles: new FormControl({value: this.settingsService.getDownloadSubtitles(), disabled: true}, Validators.required),
    videoQuality: new FormControl({value: this.settingsService.getVideoQuality(), disabled: true}, Validators.required),
  });

  constructor(
      private readonly settingsService: SettingsService,
      private readonly snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.settingsService.setSettings(this.settingsForm.value);
    this.snackBar.open(
        `Saved.`,
        ''
    );
  }

  onDownloadPathChange(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      const input: HTMLInputElement = event.target;
      if (input.files.length === 1) {
        this.settingsForm.controls.downloadPath.setValue(input.files[0].path);
      }
    }
  }

}
