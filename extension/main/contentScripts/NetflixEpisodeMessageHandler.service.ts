import { EpisodeTime, PossibleEpisodeTime } from "../common/messages";
import { retryAndGetIfSucceeded } from "./retry.util";

type EpisodeName = string | null;
export interface NetflixEpisodeInfo {
  timeMs: PossibleEpisodeTime;
  episodeName: EpisodeName;
}

type PossibleVideo = HTMLVideoElement | null;

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

  /**
   * Note that this won't find the name of movies. However, that's okay because
   * we don't need to show it.
   */
  private findEpisodeName = (): NetflixEpisodeInfo["episodeName"] => {
    const toolbar: HTMLElement | null = document.querySelector(
      '[data-uia="video-title"] span:nth-of-type(2)'
    );
    return toolbar?.innerText || null;
  };

  private getIfEpisodeNameFound = (): boolean => {
    const name: NetflixEpisodeInfo["episodeName"] = this.findEpisodeName();
    return Boolean(name);
  };

  /**
   * Note that we shouldn't set the delay too long here because there might not
   * be an episode name in the first place. Ex: If the user is watching a movie.
   */
  private waitForEpisodeName = async (): Promise<void> => {
    await retryAndGetIfSucceeded({
      getIfConditionMet: this.getIfEpisodeNameFound,
      retries: 40,
      delayMs: 50,
    });
  };

  private getIfVideoIsPlaying = (video: HTMLVideoElement): boolean => {
    return !video.paused && !video.ended;
  };

  private showToolbar = async (video: HTMLVideoElement): Promise<void> => {
    const wasPlaying: boolean = this.getIfVideoIsPlaying(video);
    video.click();
    return wasPlaying ? video.play() : video.pause();
  };

  private clickVideoAndWaitForEpisodeName = async (
    video: HTMLVideoElement
  ): Promise<EpisodeName> => {
    await this.showToolbar(video);
    await this.waitForEpisodeName();
    return this.findEpisodeName();
  };

  private getOrFindEpisodeName = async (
    video: HTMLVideoElement
  ): Promise<EpisodeName> => {
    /**
     * We check if the ep name is already there because we don't want to click
     * on the video if the toolbar is already showing. Otherwise, it will cause
     * the video to play.
     */
    const epName: EpisodeName = this.findEpisodeName();
    return epName ? epName : this.clickVideoAndWaitForEpisodeName(video);
  };

  private tryGettingEpisodeName = async (): Promise<EpisodeName> => {
    const video: PossibleVideo = this.queryVideo();
    if (video) return this.getOrFindEpisodeName(video);
    return null;
  };

  public getEpisodeInfo = async (): Promise<NetflixEpisodeInfo> => {
    const timeInMs: PossibleEpisodeTime = this.getEpisodeTime();
    const episodeName: EpisodeName = await this.tryGettingEpisodeName();
    return { timeMs: timeInMs, episodeName };
  };
}
