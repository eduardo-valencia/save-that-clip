export interface Message {
  type: Messages;
}

export enum Messages {
  getEpisodeTime = "getEpisodeTime",
}

/**
 * Time is in milliseconds.
 */
export type EpisodeTime = number;

export type PossibleEpisodeTime = EpisodeTime | null;
