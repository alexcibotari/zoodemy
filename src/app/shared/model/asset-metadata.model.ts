import {ThumbnailsData} from './thumbnails-data.model';
import {AssetMetadataOutput} from './asset-metadata-output.model';
import {AssetMetadataSource} from './asset-metadata-source.model';

export interface AssetMetadata {
  storage_bucket: string;
  job_scheduled: string;
  thumbnails_data: ThumbnailsData;
  upload_bucket: string;
  ticket_id: string;
  source: AssetMetadataSource;
  outputs: Map<string, AssetMetadataOutput>;
  original_name: string;
  domain: string;
  has_sprite: boolean;
  name: string;
}
