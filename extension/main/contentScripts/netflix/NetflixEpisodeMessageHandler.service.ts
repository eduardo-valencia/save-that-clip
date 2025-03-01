import { EpisodeTime, PossibleEpisodeTime } from "../../common/messages";
import { EPISODE_URL_PATTERN } from "../../common/netflix/netflix.constants";
import {
  NetflixEpisode,
  PlayerApp,
  PlayerAppState,
  Season,
  VideoMetadataForEpisode,
} from "../../common/netflix/netflixGlobalTypes/netflix.playerApp.types";
import _ from "lodash";

type PossibleEpisodeName = string | null;
export interface NetflixEpisodeInfo {
  timeMs: PossibleEpisodeTime;
  episodeName: PossibleEpisodeName;
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
   *
   * * Implementation Notes
   *
   * Although we can get the episode's ID from the appContext, I prefer to get
   * it this way just in case the API changes in the future, which it probably
   * will. The URL's syntax, however, likely won't change anytime soon.
   */
  private findEpisodeId = (): PossibleEpisodeId => {
    const match: RegExpMatchArray | null =
      window.location.href.match(EPISODE_URL_PATTERN);
    if (match) return parseInt(match[1]);
    return null;
  };

  private getEpisodes = (season: Season): Season["episodes"] => {
    return season.episodes;
  };

  private findEpisodeNameInSeasons = (
    episodeId: NetflixEpisode["id"],
    seasons: Season[]
  ): PossibleEpisodeName => {
    const episodes: NetflixEpisode[] = _.flatMap(seasons, this.getEpisodes);
    const episode: NetflixEpisode | undefined = _.find(episodes, {
      id: episodeId,
    });
    console.log("episode", episode);
    return episode?.title || null;
  };

  private findEpisodeName = (
    episodeId: NetflixEpisode["id"]
  ): PossibleEpisodeName => {
    const player: PlayerApp = window.netflix.appContext.getPlayerApp();
    const state: PlayerAppState = player.getState();
    const metaForEpisode: VideoMetadataForEpisode =
      state.videoPlayer.videoMetadata[episodeId];
    console.log("meta", metaForEpisode);
    return this.findEpisodeNameInSeasons(
      episodeId,
      metaForEpisode._metadataObject.video.seasons
    );
  };

  private findEpisodeIdAndGetName = (): PossibleEpisodeName => {
    const episodeId: PossibleEpisodeId = this.findEpisodeId();
    console.log("episode id", episodeId);
    return episodeId ? this.findEpisodeName(episodeId) : null;
  };

  private tryFindingEpisodeIdAndGettingName = (): PossibleEpisodeName => {
    try {
      return this.findEpisodeIdAndGetName();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  /*
   * Other
   */

  public getEpisodeInfo = async (): Promise<NetflixEpisodeInfo> => {
    console.log("processing!");
    const timeInMs: PossibleEpisodeTime = this.getEpisodeTime();
    console.log("time", timeInMs);
    const episodeName: PossibleEpisodeName =
      this.tryFindingEpisodeIdAndGettingName();
    return { timeMs: timeInMs, episodeName };
  };
}
