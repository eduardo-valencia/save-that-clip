export interface Message {
  type: Messages
}

export enum Messages {
  setEpisodeTime = 'setEpisodeTime',
  getEpisodeTime = 'getEpisodeTime',
}

export type EpisodeTime = number

export type PossibleEpisodeTime = EpisodeTime | null
