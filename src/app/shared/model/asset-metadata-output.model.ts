export interface AssetMetadataOutput {
  duration_in_ms: string;
  state: string;
  width: number;
  total_bitrate_in_kbps: number;
  type: string;
  audio_bitrate_in_kbps: number;
  audio_sample_rate: string;
  video_codec: string;
  url: string;
  label: number;
  file_size_in_bytes: string;
  video_bitrate_in_kbps: number;
  frame_rate: string;
  format: string;
  rfc_6381_audio_codec?: string;
  id?: string;
  rfc_6381_video_codec?: string;
  channels?: string;
  height: number;
  md5_checksum?: string;
  name?: string;
  audio_codec: string;
  fragment_duration_in_ms?: number;
}
