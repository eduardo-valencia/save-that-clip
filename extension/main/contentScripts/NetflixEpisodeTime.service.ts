import { EpisodeTime, PossibleEpisodeTime } from "../common/messages";

export class NetflixEpisodeMessageHandlers {
  private getVideoTimeInMs = (video: HTMLVideoElement): EpisodeTime => {
    return video.currentTime * 1000;
  };

  public sendEpisodeTime = (): PossibleEpisodeTime => {
    const video: HTMLVideoElement | null = document.querySelector("video");
    return video ? this.getVideoTimeInMs(video) : null;
  };
}
