import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
