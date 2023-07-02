export interface Message {
  type: Messages;
}

export enum Messages {
  getEpisodeTime = "getEpisodeTime",
}

export type EpisodeTime = number;

export type PossibleEpisodeTime = EpisodeTime | null;
