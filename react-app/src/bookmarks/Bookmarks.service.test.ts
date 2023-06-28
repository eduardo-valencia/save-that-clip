/* eslint-disable import/first */
import { EpisodeTime } from "../../../common/messages";
import { EpisodeService } from "../episodes/Episode.service";
import {
  SeriesInfoService,
  SeriesName,
} from "../seriesInfo/SeriesInfo.service";
import { getMockedChromeService } from "./storageMock";

jest.mock("../chrome.service", () => {
  return getMockedChromeService();
});

const episodeService = new EpisodeService();
const spiedGetTime = jest.spyOn(episodeService, "getTimeOf1stEpisodeTab");

const seriesInfoService = new SeriesInfoService();
const spiedGetSeriesName = jest.spyOn(seriesInfoService, "getSeriesName");

/**
 * * General plan:
 *
 * - Mock the episode service so we can mock the time.
 * - Mock the series info service so we can mock the series' name.
 */

interface MockedInfo {
  time: EpisodeTime;
  seriesName: SeriesName;
}

const mockTimeAndSeriesName = (): MockedInfo => {
  const info: MockedInfo = { time: 1, seriesName: "test" };
  spiedGetTime.mockResolvedValue(info.time);
  spiedGetSeriesName.mockResolvedValue(info.seriesName);
  return info;
};

describe("create", () => {
  /**
   * Plan:
   * - Mock the episode service to return a specific time.
   * - Mock the series' info service to return a specific series name.
   * - Call the method to create a bookmark. Call it with only a name.
   * - Define a method to get the expected fields.
   * - Expect the bookmark to have the expected fields.
   */
  describe("After calling it", () => {
    beforeAll(async () => {
      mockTimeAndSeriesName();
    });

    it.todo("Creates a bookmark");

    it.todo("Creates a bookmark with the provided fields");

    it.todo("Creates a bookmark with the series's name");

    it.todo("Creates a bookmark with the episode's time");
  });
});

describe("find", () => {
  it.todo("Lists bookmarks when not providing any fields");

  it.todo("Filters bookmarks by their fields");
});

describe("destroy", () => {
  it.todo("Removes a bookmark");
});
