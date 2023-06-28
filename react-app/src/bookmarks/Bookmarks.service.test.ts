/* eslint-disable import/first */
import { EpisodeService, EpisodeTabAndTime } from "../episodes/Episode.service";
import {
  SeriesInfoService,
  SeriesName,
} from "../seriesInfo/SeriesInfo.service";
import { TabsFactory } from "../tabs/Tabs.factory";
import { Bookmark } from "./Bookmarks.repo-abstraction";
import { BookmarksService, FieldsToCreateBookmark } from "./Bookmarks.service";
import { getMockedChromeService } from "./storageMock";

jest.mock("../chrome.service", () => {
  return getMockedChromeService();
});

/**
 * Services & their mocks
 */
const episodeService = new EpisodeService();
const spiedGetTabAndTime = jest.spyOn(
  episodeService,
  "get1stEpisodeTabAndTime"
);

const seriesInfoService = new SeriesInfoService();
const spiedGetSeriesName = jest.spyOn(seriesInfoService, "findSeriesName");

const { generateEpisodeTab } = new TabsFactory();

const { create, find } = new BookmarksService();

/**
 * * General plan:
 *
 * - Mock the episode service so we can mock the time.
 * - Mock the series info service so we can mock the series' name.
 */

/**
 * Other test utils.
 */

interface MockedInfo {
  episodeInfo: EpisodeTabAndTime;
  seriesName: SeriesName;
}

const getMockedInfo = (): MockedInfo => {
  return {
    episodeInfo: { time: 1, tab: generateEpisodeTab() },
    seriesName: "test",
  };
};

const mockTimeAndSeriesName = (): MockedInfo => {
  const info: MockedInfo = getMockedInfo();
  spiedGetTabAndTime.mockResolvedValue(info.episodeInfo);
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
    let mockedInfo: MockedInfo;

    const creationFields: FieldsToCreateBookmark = { name: "test" };

    const getExpectedFields = (): Partial<Bookmark> => {
      return {
        ...creationFields,
        timeMs: mockedInfo.episodeInfo.time,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        episodeUrl: mockedInfo.episodeInfo.tab.url!,
        seriesName: mockedInfo.seriesName,
      };
    };

    beforeAll(async () => {
      mockedInfo = mockTimeAndSeriesName();
      await create(creationFields);
    });

    it("Creates a bookmark with the correct fields", async () => {
      const bookmarks: Bookmark[] = await find();
      const expectedFields: Partial<Bookmark> = getExpectedFields();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const objectWithFields = expect.objectContaining(expectedFields);
      expect(bookmarks).toContainEqual(objectWithFields);
    });
  });
});

describe("find", () => {
  it.todo("Lists bookmarks when not providing any fields");

  // todo: create two bookmarks with different names to test this
  it.todo("Filters bookmarks by their fields");
});

describe("destroy", () => {
  it.todo("Removes a bookmark");
});
