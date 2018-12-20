import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  DateAdapter,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatToolbarModule,
  NativeDateAdapter
} from '@angular/material';

const ANGULAR_MODULE: any[] = [FormsModule, ReactiveFormsModule];
const ANGULAR_LAYOUT_MODULE: any[] = [FlexLayoutModule];
const MATERIAL_MODULES: any[] = [
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatToolbarModule,
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
    {provide: DateAdapter, useClass: NativeDateAdapter},
  ],
  exports: [
    ANGULAR_MODULE,
    ANGULAR_LAYOUT_MODULE,
    MATERIAL_MODULES,
  ]
})
export class SharedModule {
}
