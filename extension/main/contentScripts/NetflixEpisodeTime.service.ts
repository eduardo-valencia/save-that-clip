import { PossibleEpisodeTime } from "../common/messages";

export class NetflixEpisodeMessageHandlers {
  public sendEpisodeTime = (): PossibleEpisodeTime => {
    const video: HTMLVideoElement | null = document.querySelector("video");
    return video ? video.currentTime : null;
  };
}
