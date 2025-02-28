import { EpisodeTime, PossibleEpisodeTime } from "../../common/messages";
import { EPISODE_URL_PATTERN } from "../../common/netflix.constants";
import { retryAndGetIfSucceeded } from "./retry.util";
import _ from "lodash";

type EpisodeName = string | null;
export interface NetflixEpisodeInfo {
  timeMs: PossibleEpisodeTime;
  episodeName: EpisodeName;
}

type PossibleVideo = HTMLVideoElement | null;

type PossibleEpisodeId = number | null;

export class NetflixEpisodeMessageHandlers {
  private getVideoTimeInMs = (video: HTMLVideoElement): EpisodeTime => {
    return video.currentTime * 1000;
  };

  private queryVideo = (): PossibleVideo => {
    return document.querySelector("video");
  };

  private getEpisodeTime = (): PossibleEpisodeTime => {
    const video: PossibleVideo = this.queryVideo();
    return video ? this.getVideoTimeInMs(video) : null;
  };

  /*
   * Toolbar
   */
  /**
   * Note that this won't find the name of movies. However, that's okay because
   * we don't need to show it.
   */
  private findEpisodeId = (): PossibleEpisodeId => {
    const match: RegExpMatchArray | null =
      window.location.pathname.match(EPISODE_URL_PATTERN);
    if (match) return parseInt(match[1]);
    return null;
  };

  private findEpisodeNameUsingApi = async (): Promise<EpisodeName> => {
    const episodeId: PossibleEpisodeId = this.findEpisodeId();
    const player = netflix.appContext.getPlayerApp();
    const state = player.getState();
    if (episodeId) return videoPlayer.videoMetadata[episodeId]._seasons;
    return null;
  };

  /*
   * Other
   */

  public getEpisodeInfo = async (): Promise<NetflixEpisodeInfo> => {
    const timeInMs: PossibleEpisodeTime = this.getEpisodeTime();
    const episodeName: EpisodeName = await this.tryGettingEpisodeName();
    return { timeMs: timeInMs, episodeName };
  };
}
