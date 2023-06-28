/**
 * ! Important
 *
 * We are mocking certain methods and services. Please see below and the
 * service definitions for more info.
 *
 * * Notes
 *
 * - Multiple tests are creating bookmarks here, so do not assume that the
 *   bookmarks list is empty by default.
 */

import { getMockedChromeService } from "./storageMock";

jest.mock("../chrome.service", () => {
  return getMockedChromeService();
});

/* eslint-disable import/first */
import { EpisodeService, EpisodeTabAndTime } from "../episodes/Episode.service";
import {
  SeriesInfoService,
  SeriesName,
} from "../seriesInfo/SeriesInfo.service";
import { MockedTabsRepo } from "../tabs/MockedTabs.repo";
import { TabsFactory } from "../tabs/Tabs.factory";
import { Bookmark } from "./Bookmarks.repo-abstraction";
import {
  BookmarksService,
  FieldsToCreateBookmark as CreationFields,
} from "./Bookmarks.service";
import _ from "lodash";

/**
 * * Services & their mocks
 */
// ! This is mocked.
const tabsRepo = new MockedTabsRepo();

// Episode service
const episodeService = new EpisodeService({ tabsRepo });

const spiedGetTabAndTime = jest.spyOn(
  episodeService,
  "get1stEpisodeTabAndTime"
);

// Series info
const seriesInfoService = new SeriesInfoService();

const spiedGetSeriesName = jest.spyOn(seriesInfoService, "findSeriesName");

// Other
const { generateEpisodeTab } = new TabsFactory();

const { create, find } = new BookmarksService({
  episodeService,
  seriesInfoService,
});

/**
 * * Other test utils.
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

const generateUniqueBookmark = async (): Promise<CreationFields> => {
  const creationFields: CreationFields = { name: _.uniqueId() };
  await create(creationFields);
  return creationFields;
};

describe("create / find", () => {
  /**
   * Plan:
   * - Mock the episode service to return a specific time.
   * - Mock the series' info service to return a specific series name.
   * - Call the method to create a bookmark. Call it with only a name.
   * - Define a method to get the expected fields.
   * - Expect the bookmark to have the expected fields.
   */
  describe("After creating one", () => {
    let mockedInfo: MockedInfo;
    let creationFields: CreationFields;

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
      creationFields = await generateUniqueBookmark();
      await create(creationFields);
    });

    /**
     * We combined both of these tests because the functionality is the same for
     * both.
     */
    const findTest = "Finds all bookmarks when we don't provide fields";
    const createTest = "Creates a bookmark with the correct fields";

    it(`${createTest} / ${findTest}`, async () => {
      const bookmarks: Bookmark[] = await find();
      const expectedFields: Partial<Bookmark> = getExpectedFields();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const objectWithFields = expect.objectContaining(expectedFields);
      expect(bookmarks).toContainEqual(objectWithFields);
    });
  });
});

describe("find", () => {
  let generatedBookmark: CreationFields;

  beforeAll(async () => {
    // Otherwise, generating a bookmark might not work.
    mockTimeAndSeriesName();
    /**
     * We make a bookmark because most tests require one.
     */
    generatedBookmark = await generateUniqueBookmark();
  });

  it("Returns all bookmarks when providing empty fields", async () => {
    const bookmarks: Bookmark[] = await find({});
    expect(bookmarks.length).toBeGreaterThanOrEqual(1);
  });

  /**
   * Plan:
   * - Define a method to generate a unique bookmark. it should return the
   *   cration fields.
   * - Call it twice.
   * - Find the first bookmark using its first creation fields.
   * - Expect the returned value to have one bookmark.
   * - Expect the bookmark to match the creation fields.
   */
  describe("When filtering bookmarks by their fields", () => {
    beforeAll(async () => {
      /**
       * We make another bookmark so we can test it returns the correct one.
       */
      await generateUniqueBookmark();
    });

    it("Returns only the correct bookmarks", async () => {
      const bookmarks: Bookmark[] = await find(generatedBookmark);
      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0]).toMatchObject(generatedBookmark);
    });
  });
});

describe("destroy", () => {
  it.todo("Removes a bookmark");
});
