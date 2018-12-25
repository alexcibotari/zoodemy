import {Locale} from './locale.model';

export interface Caption {
  _class: string;
  id: number;
  title: string;
  created: string;
  file_name: string;
  status: number;
  locale: Locale;
  url: string;
  source: string;
  video_label: string;
}
