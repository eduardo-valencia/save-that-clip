interface VideoPlayerInAppContext {
  getAllPlayerSessionIds: () => unknown;
}

interface PlayerAppApi {
  videoPlayer: VideoPlayerInAppContext;
}

interface PlayerAppInAppContext {
  getAPI: () => PlayerAppApi;
}

export interface AppContextState {
  playerApp: PlayerAppInAppContext;
}
