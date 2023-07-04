/**
 * ! Important
 *
 * We are mocking certain methods and services. Please see below and the
 * service definitions for more info. Also, please note that we are resetting
 * and clearing mocks after each test.
 *
 * * Notes
 *
 * - Multiple tests are creating bookmarks here, so do not assume that the
 *   bookmarks list is empty by default.
 */

import { getMockedChromeService } from "./storageMock";

jest.mock("../../../main/common/chrome.service", () => {
  return getMockedChromeService();
});

/* eslint-disable import/first */
import _ from "lodash";
import {
  EpisodeService,
  EpisodeTabAndTime,
  ResultOfSettingTime,
} from "../episodes/Episode.service";
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
import { MockedScriptsRepo } from "../scripts/MockedScripts.repo";

/**
 * * Services & their mocks
 */
const mockedTabsRepo = new MockedTabsRepo();
/**
 * We must mock this to avoid trying to load "chrome," which does not exist.
 */
const mockedScriptsRepo = new MockedScriptsRepo();

// Episode service
const episodeService = new EpisodeService({
  tabsRepo: mockedTabsRepo,
  scriptsRepo: mockedScriptsRepo,
});

const spiedGetTabAndTime = jest.spyOn(
  episodeService,
  "get1stEpisodeTabAndTime"
);

// Series info
const seriesInfoService = new SeriesInfoService();

// todo: See if we actually have to put these in the global scope, or if we can
// just put them in mockTimeAndSeriesName
const spiedGetSeriesName = jest.spyOn(seriesInfoService, "findSeriesName");

// Other
const { generateEpisodeTab } = new TabsFactory();

const { create, find, destroy, open } = new BookmarksService({
  episodeService,
  seriesInfoService,
  tabsRepo: mockedTabsRepo,
});

/**
 * * Other test utils.
 */

interface MockedTimeAndSeries {
  episodeInfo: EpisodeTabAndTime;
  seriesName: SeriesName;
}

const getMockedTimeAndSeries = (): MockedTimeAndSeries => {
  return {
    episodeInfo: { time: 1, tab: generateEpisodeTab() },
    seriesName: "test",
  };
};

const mockTimeAndSeriesName = (): MockedTimeAndSeries => {
  const info: MockedTimeAndSeries = getMockedTimeAndSeries();
  spiedGetTabAndTime.mockResolvedValue(info.episodeInfo);
  spiedGetSeriesName.mockResolvedValue(info.seriesName);
  return info;
};

interface BookmarkInfo {
  creationFields: CreationFields;
  bookmark: Bookmark;
}

/**
 * * Important
 *
 * Make sure to mock the services first. @see mockTimeAndSeriesName
 */
const generateUniqueBookmark = async (): Promise<BookmarkInfo> => {
  const creationFields: CreationFields = { name: _.uniqueId() };
  const bookmark: Bookmark = await create(creationFields);
  return { bookmark, creationFields };
};

const mockServicesAndGenerateUniqueBookmark = (): Promise<BookmarkInfo> => {
  // Otherwise, generating a bookmark might not work.
  mockTimeAndSeriesName();
  return generateUniqueBookmark();
};

/**
 * We must reset and clear the mocks to avoid tests interfering with each other.
 */
afterEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("create / find", () => {
  describe("After creating one when one already exists", () => {
    let mockedInfo: MockedTimeAndSeries;
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
      // We create one to ensure we can correctly find the correct bookmark
      ({ creationFields } = await generateUniqueBookmark());
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

describe("create", () => {
  describe("When the tab's url has params", () => {
    const baseUrl = "http://netflix.com/watch/123";

    const getTabUrl = (): string => {
      return `${baseUrl}?t=300`;
    };

    const createEpisodeInfo = (): EpisodeTabAndTime => {
      const { episodeInfo }: MockedTimeAndSeries = getMockedTimeAndSeries();
      const { tab, ...other } = episodeInfo;
      return { ...other, tab: { ...tab, url: getTabUrl() } };
    };

    const mockTimeAndTab = (): void => {
      const episodeInfo: EpisodeTabAndTime = createEpisodeInfo();
      spiedGetTabAndTime.mockResolvedValue(episodeInfo);
    };

    beforeAll(() => {
      mockTimeAndSeriesName();
      // This overwrites part of the previous mocked info.
      mockTimeAndTab();
    });

    it("Sets the bookmark's URL without them", async () => {
      const { bookmark }: BookmarkInfo = await generateUniqueBookmark();
      expect(bookmark.episodeUrl).toEqual(baseUrl);
    });
  });

  /**
   * We might want an explicit test because we don't know whether the mocked tab
   * has params by default.
   */
  it.todo("Works when the URL does not have params");
});

describe("find", () => {
  let generatedBookmark: CreationFields;

  beforeEach(async () => {
    /**
     * We make a bookmark because most tests require one.
     */
    ({ bookmark: generatedBookmark } =
      await mockServicesAndGenerateUniqueBookmark());
  });

  it("Returns all bookmarks when providing empty fields", async () => {
    const bookmarks: Bookmark[] = await find({});
    expect(bookmarks.length).toBeGreaterThanOrEqual(1);
  });

  describe("When filtering bookmarks by their fields", () => {
    beforeEach(async () => {
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
  describe("After destroying a bookmark", () => {
    let generatedBookmark: Bookmark;

    beforeAll(async () => {
      ({ bookmark: generatedBookmark } =
        await mockServicesAndGenerateUniqueBookmark());
      await destroy(generatedBookmark.id);
    });

    it("Removes it", async () => {
      const bookmarks: Bookmark[] = await find(generatedBookmark);
      expect(bookmarks).toHaveLength(0);
    });
  });
});

describe("open", () => {
  const generateAndOpenBookmark = async (): Promise<BookmarkInfo> => {
    const info: BookmarkInfo = await generateUniqueBookmark();
    await open(info.bookmark.id);
    return info;
  };

  type SpiedSetTime = jest.SpiedFunction<EpisodeService["trySettingTime"]>;

  const mockSettingTime = (
    success: ResultOfSettingTime["success"]
  ): SpiedSetTime => {
    const spiedSetTime = jest.spyOn(episodeService, "trySettingTime");
    spiedSetTime.mockResolvedValue({ success });
    return spiedSetTime;
  };

  const mockFindingBookmarkTab = (mockedInfo: MockedTimeAndSeries): void => {
    const spiedFind = jest.spyOn(
      episodeService,
      "findOneEpisodeTabWithSamePathAsUrl"
    );
    spiedFind.mockResolvedValue(mockedInfo.episodeInfo.tab);
  };

  // For testing setting the episode's time
  const mockTimeAndSeriesAndFindingBookmarkTab = (): void => {
    const mockedInfo: MockedTimeAndSeries = mockTimeAndSeriesName();
    mockFindingBookmarkTab(mockedInfo);
  };

  const mockCreatingTab = (): void => {
    const tab: chrome.tabs.Tab = generateEpisodeTab();
    mockedTabsRepo.create.mockResolvedValue(tab);
  };

  describe("After opening the bookmark when it's not already open & its time is not divisible by a thousand", () => {
    let bookmark: Bookmark;

    const mockGettingTime = (): void => {
      const info: MockedTimeAndSeries = getMockedTimeAndSeries();
      info.episodeInfo.time = 101;
      spiedGetTabAndTime.mockResolvedValue(info.episodeInfo);
    };

    const getExpectedTime = (): number => {
      const timeInSeconds: number = bookmark.timeMs / 1000;
      return Math.floor(timeInSeconds);
    };

    const getExpectedUrl = (): string => {
      const url = new URL(bookmark.episodeUrl);
      const expectedTime: number = getExpectedTime();
      url.searchParams.append("t", expectedTime.toString());
      return url.href;
    };

    beforeEach(async () => {
      mockCreatingTab();
      mockTimeAndSeriesName();
      /**
       * This partially overwrites @see mockTimeAndSeriesName.
       */
      mockGettingTime();
      ({ bookmark } = await generateAndOpenBookmark());
    });

    /**
     * This test case is important because the time must be in seconds, but the
     * bookmark's time is in milliseconds. Therefore, we need to round the
     * result down to the nearest second.
     */
    it("Opens a new episode tab with the correct time in seconds", () => {
      expect(mockedTabsRepo.create).toHaveBeenCalledWith({
        active: true,
        url: getExpectedUrl(),
      });
    });

    it.todo("Does not try to update the episode's time");

    it.todo("Works when the URL already has params");

    /**
     * Note: I already tested this, but it might be a good idea to test this to
     * ensure it doesn't break in the future.
     */
    it.todo('Works when the URL has a "t" param');
  });

  describe("After calling it when the episode is open", () => {
    let bookmark: Bookmark;
    let spiedSetTime: SpiedSetTime;

    const setUpMocks = (): void => {
      mockTimeAndSeriesAndFindingBookmarkTab();
      spiedSetTime = mockSettingTime(true);
    };

    beforeEach(async () => {
      setUpMocks();
      /**
       * Note that the bookmark already has the tab's URL because of how
       * bookmarks are created.
       */
      ({ bookmark } = await generateAndOpenBookmark());
    });

    it("Sets the video's time to the bookmark's time", () => {
      expect(spiedSetTime).toHaveBeenCalledWith(bookmark.timeMs);
    });

    it("Does not create a tab", () => {
      expect(mockedTabsRepo.create).not.toHaveBeenCalled();
    });
  });

  describe("When we failed to set the time", () => {
    beforeAll(() => {
      mockTimeAndSeriesAndFindingBookmarkTab();
      mockCreatingTab();
      mockSettingTime(false);
    });

    it("Opens a new tab", async () => {
      await generateAndOpenBookmark();
      expect(mockedTabsRepo.create).toHaveBeenCalled();
    });
  });

  // Note: These cases are less important since they're unlikely to happen.
  describe("When an unrelated tab is open", () => {
    it.todo("Does not send a message to that tab");
  });

  describe("When there are multiple tabs open for the same bookmark", () => {
    it.todo("Does not crash");
  });
});
