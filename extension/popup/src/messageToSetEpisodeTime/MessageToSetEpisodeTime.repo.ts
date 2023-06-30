import { Messages } from "../../../common/messages";
import { MessageToSetEpisodeTimeRepoAbstraction } from "./MessageToSetEpisodeTime.repo-abstraction";

/**
 * @deprecated
 */
export class MessageToSetEpisodeTimeRepo extends MessageToSetEpisodeTimeRepoAbstraction {
  public sendMessageToSetEpisodeTime = async (
    timeMs: number
  ): Promise<void> => {
    await chrome.runtime.sendMessage({ type: Messages.setEpisodeTime, timeMs });
  };
}
