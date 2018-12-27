import {AssetType} from './asset-type.model';
import {Caption} from './caption.model';
import {FileMetadata} from './file-metadata.model';
import {AssetMetadata} from './asset-metadata.model';

export interface Asset {
  _class: string;
  id: number;
  title: string;
  asset_type: AssetType;
  created: string;
  captions: Caption[];
  body: string;
  filename: string;
  download_urls: { [header: string]: FileMetadata[] };
  stream_urls: { [header: string]: FileMetadata[] };
  data: AssetMetadata;
}
