import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthService} from './service/auth.service';
import {UdemyService} from './service/udemy.service';
import {SettingsService} from './service/settings.service';

const ANGULAR_MODULE: any[] = [FormsModule, ReactiveFormsModule];
const ANGULAR_LAYOUT_MODULE: any[] = [FlexLayoutModule];
const MATERIAL_MODULES: any[] = [
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule
];

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ANGULAR_MODULE,
    ANGULAR_LAYOUT_MODULE,
    MATERIAL_MODULES
  ],
  declarations: [],
  entryComponents: [],
  providers: [
    AuthService,
    UdemyService,
    SettingsService
  ],
  exports: [
    ANGULAR_MODULE,
    ANGULAR_LAYOUT_MODULE,
    MATERIAL_MODULES,
    BrowserAnimationsModule
  ]
})
export class SharedModule {
}
