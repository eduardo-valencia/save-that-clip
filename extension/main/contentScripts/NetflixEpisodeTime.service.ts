import { Message, PossibleEpisodeTime } from "../common/messages";
import { Sender } from "../content-script";

export class NetflixEpisodeMessageHandlers {
  // todo: Consider simplifying the arguments that this receives and how we can
  // send back a response. Ex: content-script.ts could simply send back whatever
  // object this method returns.
  public sendEpisodeTime = (
    message: Message,
    sender: Sender
  ): PossibleEpisodeTime => {
    // const video: HTMLVideoElement | null = document.querySelector('video')
    // if (!video)
  };
}
