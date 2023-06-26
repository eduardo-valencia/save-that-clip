export abstract class MessageToSetEpisodeTimeRepoAbstraction {
  abstract sendMessageToSetEpisodeTime: (timeMs: number) => Promise<void>;
}
