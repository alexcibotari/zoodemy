import {Asset} from './asset.model';

export interface Lecture {
  _class: string;
  id: number;
  title: string;
  created: string;
  description: string;
  title_cleaned: string;
  is_published: boolean;
  transcript: string;
  is_downloadable: boolean;
  is_free: boolean;
  asset: Asset;
  supplementary_assets: Asset[];
  sort_order: number;
  object_index: number;
}
