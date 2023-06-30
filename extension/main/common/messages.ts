export interface Message {
  type: Messages;
}

export enum Messages {
  setEpisodeTime = "setEpisodeTime",
  getEpisodeTime = "getEpisodeTime",
}

export type EpisodeTime = number;

export type PossibleEpisodeTime = EpisodeTime | null;

export interface MessageToSetEpisodeTime extends Message {
  type: Messages.setEpisodeTime;
  timeMs: number;
}
