interface Player {
  seek: (timeMs: number) => void;
}

interface VideoPlayerInAppContext {
  getAllPlayerSessionIds: () => string[];
  getVideoPlayerBySessionId: (id: string) => Player;
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
