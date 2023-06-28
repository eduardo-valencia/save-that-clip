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

const spiedGetSeriesName = jest.spyOn(seriesInfoService, "findSeriesName");

// Other
const { generateEpisodeTab } = new TabsFactory();

const { create, find, destroy, open } = new BookmarksService({
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

/**
 * ! Important
 *
 * Make sure to mock the services first. @see mockTimeAndSeriesName
 */
const generateUniqueBookmark = async (): Promise<CreationFields> => {
  const creationFields: CreationFields = { name: _.uniqueId() };
  await create(creationFields);
  return creationFields;
};

const mockServicesAndGenerateUniqueBookmark = (): Promise<CreationFields> => {
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

describe("create", () => {
  it("Returns the bookmark", async () => {});
});

describe("find", () => {
  let generatedBookmark: CreationFields;

  beforeAll(async () => {
    /**
     * We make a bookmark because most tests require one.
     */
    generatedBookmark = await mockServicesAndGenerateUniqueBookmark();
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
    let generatedBookmark: CreationFields;

    const findBookmarksWithCreationFields = async (): Promise<Bookmark[]> => {
      return find(generatedBookmark);
    };

    const getBookmarkId = async (): Promise<Bookmark["id"]> => {
      const bookmarks: Bookmark[] = await findBookmarksWithCreationFields();
      if (bookmarks.length !== 1) throw new Error("Bookmark not found.");
      return bookmarks[0].id;
    };

    beforeAll(async () => {
      generatedBookmark = await mockServicesAndGenerateUniqueBookmark();
      const id: Bookmark["id"] = await getBookmarkId();
      await destroy(id);
    });

    it("Removes it", async () => {
      const bookmarks: Bookmark[] = await findBookmarksWithCreationFields();
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
  /**
   * - Also mock the tabs repo's method to create a new tab.
   * - Create a unique bookmark.
   * - Call the method.
   */
  describe("When the bookmark is not already open", () => {
    let creationFields: CreationFields;

    const mockCreatingTab = (): void => {
      const tab: chrome.tabs.Tab = generateEpisodeTab();
      tabsRepo.create.mockResolvedValue(tab);
    };

    beforeAll(async () => {
      mockCreatingTab();
      mockTimeAndSeriesName();
      creationFields = await generateUniqueBookmark();
      // await open()
    });

    /**
     * - Expect a new tab to have been created with "active" set to "true" and
     *   with the correct URL.
     */
    it.todo("Opens a new tab with the bookmark");
  });

  /**
   * - Mock the EpisodeService.sendMessageToSetEpisodeTime to resolve to nothing.
   * - Create a unique bookmark.
   * - Call the method.
   */
  describe("When the bookmark is open", () => {
    /**
     * - Find the bookmark using the creation fields so we can get its time.
     * - Expect sendMessageToSetEpisodeTime to have been called with the correct
     *   time.
     */
    it.todo("Sets the video's time to the bookmark's time");
  });

  // Note: These cases are less important since they're unlikely to happen.
  describe("When an unrelated tab is open", () => {
    it.todo("Does not send a message to that tab");
  });

  describe("When there are multiple tabs open for the same bookmark", () => {
    it.todo("Does not crash");
  });
});
