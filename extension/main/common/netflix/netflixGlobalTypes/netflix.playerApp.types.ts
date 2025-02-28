export interface NetflixEpisode {
  id: number;
  title: string;
}

export interface Season {
  id: string;
  episodes: NetflixEpisode[];
}

interface VideoInMetadataObject {
  seasons: Season[];
}

interface MetadataObject {
  video: VideoInMetadataObject;
}

export interface VideoMetadataForEpisode {
  _metadataObject: MetadataObject;
}

interface VideoPlayer {
  videoMetadata: Record<string, VideoMetadataForEpisode>;
}

export interface PlayerAppState {
  videoPlayer: VideoPlayer;
}

export interface PlayerApp {
  getState: () => PlayerAppState;
}
