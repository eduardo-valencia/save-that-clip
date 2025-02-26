import {
  EpisodeTime,
  PossibleEpisodeTime,
} from "../../../main/common/messages";
import { retryAndGetIfSucceeded } from "../../../main/contentScripts/retry.util";

type EpisodeName = string | null;
export interface NetflixEpisodeInfo {
  timeMs: PossibleEpisodeTime;
  episodeName: EpisodeName;
  success: true;
}

type PossibleVideo = HTMLVideoElement | null;

const getVideoTimeInMs = (video: HTMLVideoElement): EpisodeTime => {
  return video.currentTime * 1000;
};

const queryVideo = (): PossibleVideo => {
  return document.querySelector("video");
};

const getEpisodeTime = (): PossibleEpisodeTime => {
  const video: PossibleVideo = queryVideo();
  return video ? getVideoTimeInMs(video) : null;
};

/**
 * Note that this won't find the name of movies. However, that's okay because
 * we don't need to show it.
 */
const findEpisodeName = (): NetflixEpisodeInfo["episodeName"] => {
  const toolbar: HTMLElement | null = document.querySelector(
    '[data-uia="video-title"] span:nth-of-type(2)'
  );
  return toolbar?.innerText || null;
};

const getIfEpisodeNameFound = (): boolean => {
  const name: NetflixEpisodeInfo["episodeName"] = findEpisodeName();
  return Boolean(name);
};

/**
 * Note that we shouldn't set the delay too long here because there might not
 * be an episode name in the first place. Ex: If the user is watching a movie.
 */
const waitForEpisodeName = async (): Promise<void> => {
  await retryAndGetIfSucceeded({
    getIfConditionMet: getIfEpisodeNameFound,
    retries: 40,
    delayMs: 50,
  });
};

const clickVideoAndWaitForEpisodeName = async (
  video: HTMLVideoElement
): Promise<EpisodeName> => {
  video.click();
  await waitForEpisodeName();
  return findEpisodeName();
};

const getOrFindEpisodeName = async (
  video: HTMLVideoElement
): Promise<EpisodeName> => {
  /**
   * We check if the ep name is already there because we don't want to click
   * on the video if the toolbar is already showing. Otherwise, it will cause
   * the video to play.
   */
  const epName: EpisodeName = findEpisodeName();
  return epName ? epName : clickVideoAndWaitForEpisodeName(video);
};

const tryGettingEpisodeName = async (): Promise<EpisodeName> => {
  const video: PossibleVideo = queryVideo();
  if (video) return getOrFindEpisodeName(video);
  return null;
};

export const getEpisodeInfo = async (): Promise<NetflixEpisodeInfo> => {
  // const timeInMs: PossibleEpisodeTime = getEpisodeTime();
  // const episodeName: EpisodeName = await tryGettingEpisodeName();
  // return { timeMs: timeInMs, episodeName, success: true };
  return { timeMs: 1000, episodeName: "teest", success: true };
};
