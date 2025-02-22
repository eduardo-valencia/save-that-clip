import { Bookmark } from "../bookmarks/Bookmarks.repo-abstraction";
import { ResultOfSettingTime } from "./Episode.service";

/**
 * This is used in an injected script, but it is not actually accessible
 * anywhere besides the injected script. In other words, don't use this.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
declare const netflix: any;

/**
 * This class's methods are being injected into the Netflix episode's tab.
 */
export class NetflixSeekerService {
  public seek = (timeMs: Bookmark["timeMs"]): ResultOfSettingTime => {
    const getIfAdIsShowing = (): boolean => {
      const adsInfoContainer = document.querySelector(
        '[data-uia="ads-info-container"]'
      );
      return Boolean(adsInfoContainer);
    };

    const getIfCanSeekTime = (): boolean => {
      const isAdShowing: boolean = getIfAdIsShowing();
      /**
       * If the video isn't on the page, it could mean that the page is loading
       * for too long. Regardless of the reason, it would mean that the user would
       * think that the extension isn't opening the actual bookmark. So, we return
       * false so we can move on to the fallback strategy.
       */
      const video: HTMLVideoElement | null = document.querySelector("video");
      return !isAdShowing && Boolean(video);
    };

    const seekWithNetflixApi = (timeMs: Bookmark["timeMs"]): void => {
      /* eslint-disable @typescript-eslint/no-unsafe-return */
      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
      /* eslint-disable @typescript-eslint/no-unsafe-call */
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      // TODO: Maybe stop assuming that any of these properties will exist
      const { videoPlayer } = netflix.appContext.state.playerApp.getAPI();
      const [sessionId] = videoPlayer.getAllPlayerSessionIds();
      const player = videoPlayer.getVideoPlayerBySessionId(sessionId);
      player.seek(timeMs);
      /* eslint-enable @typescript-eslint/no-unsafe-return */
      /* eslint-enable @typescript-eslint/no-unsafe-member-access */
      /* eslint-enable @typescript-eslint/no-unsafe-call */
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    };

    const canSeekTime: boolean = getIfCanSeekTime();
    if (!canSeekTime) return { success: false };
    seekWithNetflixApi(timeMs);
    return { success: true };
  };
}
