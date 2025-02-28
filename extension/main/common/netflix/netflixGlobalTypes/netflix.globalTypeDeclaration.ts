/**
 * TODO: Maybe separate the declaration from the types
 */

import { AppContextState } from "./netflix.appContextState.types";

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

interface AppContext {
  getPlayerApp: () => PlayerApp;
  state: AppContextState;
}

interface Netflix {
  appContext: AppContext;
}

/**
 * TODO: Check if this is accidentally available outside of the file
 */
declare global {
  /**
   * This is used in injected scripts, but it is not actually accessible
   * anywhere besides injected scripts. In other words, don't use this.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const netflix: Netflix;
}
