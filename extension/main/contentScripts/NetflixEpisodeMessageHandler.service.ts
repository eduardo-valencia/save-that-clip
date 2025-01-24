import { EpisodeTime, PossibleEpisodeTime } from "../common/messages";

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

  private findEpisodeName = (): NetflixEpisodeInfo["episodeName"] => {
    const toolbar: HTMLElement | null = document.querySelector(
      '[data-uia="video-title"] h4'
    );
    return toolbar ? toolbar.innerText : null;
  };

  private getIfEpisodeNameFound = (): boolean => {
    const name: EpisodeName = this.findEpisodeName();
    return typeof name === "string";
  };

  private waitForEpisodeNameToShow = async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  };

  private clickVideoAndWaitForEpisodeName = async (
    video: HTMLVideoElement
  ): Promise<EpisodeName> => {
    video.click();
    await this.waitForEpisodeNameToShow();
    return this.findEpisodeName();
  };

  private tryGettingEpisodeName = async (): Promise<EpisodeName> => {
    const video: PossibleVideo = this.queryVideo();
    if (video) return this.clickVideoAndWaitForEpisodeName(video);
    return null;
  };

  public getEpisodeInfo = async (): Promise<NetflixEpisodeInfo> => {
    const timeInMs: PossibleEpisodeTime = this.getEpisodeTime();
    const episodeName: EpisodeName = await this.tryGettingEpisodeName();
    console.log("time", timeInMs);
    console.log("episode name", episodeName);
    return { timeMs: timeInMs, episodeName };
  };
}
