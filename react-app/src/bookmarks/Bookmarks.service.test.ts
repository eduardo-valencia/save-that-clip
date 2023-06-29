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
import _ from "lodash";
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

// todo: See if we actually have to put these in the global scope, or if we can
// just put them in mockTimeAndSeriesName
const spiedGetSeriesName = jest.spyOn(seriesInfoService, "findSeriesName");

// Other
const { generateEpisodeTab } = new TabsFactory();

const { create, find, destroy, open } = new BookmarksService({
  episodeService,
  seriesInfoService,
  tabsRepo,
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

interface BookmarkInfo {
  creationFields: CreationFields;
  bookmark: Bookmark;
}

/**
 * ! Important
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

describe("create / find", () => {
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

describe("find", () => {
  let generatedBookmark: CreationFields;

  beforeAll(async () => {
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

/**
 * Plan:
 *
 * - Mock the services like we did before.
 */
describe("open", () => {
  const generateAndOpenBookmark = async (): Promise<BookmarkInfo> => {
    const info: BookmarkInfo = await generateUniqueBookmark();
    await open(info.bookmark.id);
    return info;
  };

  /**
   * - Also mock the tabs repo's method to create a new tab.
   * - Create a unique bookmark.
   * - Call the method.
   */
  describe("When the bookmark is not already open", () => {
    let bookmark: Bookmark;

    const mockCreatingTab = (): void => {
      const tab: chrome.tabs.Tab = generateEpisodeTab();
      tabsRepo.create.mockResolvedValue(tab);
    };

    beforeAll(async () => {
      mockCreatingTab();
      mockTimeAndSeriesName();
      ({ bookmark } = await generateAndOpenBookmark());
    });

    /**
     * - Expect a new tab to have been created with "active" set to "true" and
     *   with the correct URL.
     */
    it("Opens a new tab with the bookmark", () => {
      expect(tabsRepo.create).toHaveBeenCalledWith({
        active: true,
        url: bookmark.episodeUrl,
      });
    });
  });

  /**
   * - Mock the EpisodeService.sendMessageToSetEpisodeTime to resolve to nothing.
   * - Create a unique bookmark.
   * - Call the method.
   */
  describe("When the bookmark is open", () => {
    let bookmark: Bookmark;

    let spiedSetTime: jest.SpiedFunction<
      EpisodeService["sendMessageToSetEpisodeTime"]
    >;

    const mockSettingTime = (): void => {
      spiedSetTime = jest.spyOn(episodeService, "sendMessageToSetEpisodeTime");
      spiedSetTime.mockResolvedValue();
    };

    // todo: clear mock
    const mockFindingBookmarkTab = (mockedInfo: MockedInfo): void => {
      const spiedFind = jest.spyOn(episodeService, "findOneEpisodeTabByUrl");
      spiedFind.mockResolvedValue(mockedInfo.episodeInfo.tab);
    };

    beforeAll(async () => {
      mockSettingTime();
      const mockedInfo: MockedInfo = mockTimeAndSeriesName();
      mockFindingBookmarkTab(mockedInfo);
      /**
       * Note that the bookmark already has the tab's URL because of how
       * bookmarks are created.
       */
      ({ bookmark } = await generateAndOpenBookmark());
    });

    /**
     * - Find the bookmark using the creation fields so we can get its time.
     * - Expect sendMessageToSetEpisodeTime to have been called with the correct
     *   time.
     */
    it("Sets the video's time to the bookmark's time", () => {
      expect(spiedSetTime).toHaveBeenCalledWith(bookmark.timeMs);
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
