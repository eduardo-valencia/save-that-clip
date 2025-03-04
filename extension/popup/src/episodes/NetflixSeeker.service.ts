import { Bookmark } from "../bookmarks/Bookmarks.repo-abstraction";
import { Netflix } from "../../../main/common/netflix/netflixGlobalTypes/netflix.globalType";

type SuccessInfo<WasSuccessful> = { success: WasSuccessful };
type FailureInfo = SuccessInfo<false> & { reason?: string };
export type ResultOfSettingNetflixTime = SuccessInfo<true> | FailureInfo;

declare const netflix: Netflix;

export const trySeekingForNetflix = (
  timeMs: Bookmark["timeMs"]
): ResultOfSettingNetflixTime => {
  const getIfAdIsShowing = (): boolean => {
    const adsInfoContainer = document.querySelector(
      '[data-uia="ads-info-container"]'
    );
    const pauseAd = document.querySelector('[data-uia="pause-ad"]');
    return Boolean(adsInfoContainer || pauseAd);
  };

  type PossibleReason = string | null;

  const getReasonWeCannotSeekTime = (): PossibleReason => {
    const isAdShowing: boolean = getIfAdIsShowing();
    if (isAdShowing) return "ad is showing";
    /**
     * If the video isn't on the page, it could mean that the page is loading
     * for too long. Regardless of the reason, it would mean that the user would
     * think that the extension isn't opening the actual bookmark. So, we return
     * false so we can move on to the fallback strategy.
     */
    const video: HTMLVideoElement | null = document.querySelector("video");
    if (!video) return "video is missing";
    return null;
  };

  const seek = (timeMs: Bookmark["timeMs"]): void => {
    // TODO: Maybe stop assuming that any of these properties will exist
    // because they sometimes don't if the page hasn't been fully loaded
    // and because the API could change in the future. At least wrap it with a tr/catch
    const { videoPlayer } = netflix.appContext.state.playerApp.getAPI();
    const [sessionId] = videoPlayer.getAllPlayerSessionIds();
    const player = videoPlayer.getVideoPlayerBySessionId(sessionId);
    player.seek(timeMs);
  };

  /**
   * We return the reason instead of simply logging it so it can be sent to
   * Sentry. Note that Sentry doesn't capture logs in injected scripts.
   */
  const handleInabilityToSeek = (
    reason: string
  ): ResultOfSettingNetflixTime => {
    console.error("Failed to seek time because", reason);
    return { success: false, reason };
  };

  const reasonWeCannotSeekTime: PossibleReason = getReasonWeCannotSeekTime();
  if (reasonWeCannotSeekTime)
    return handleInabilityToSeek(reasonWeCannotSeekTime);
  seek(timeMs);
  return { success: true };
};
