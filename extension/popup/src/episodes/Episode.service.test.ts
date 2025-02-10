/**
 * ! Important
 *
 * We reset mocks after each test.
 *
 * * Notes
 *
 * - An "episode tab" is an active tab with a Netflix episode.
 */

import { EpisodeTime } from "../../../main/common/messages";
import {
  EpisodeService,
  EpisodeTabAndInfo,
  PossibleTab,
  ResultOfSettingTime,
} from "./Episode.service";
import { TabsFactory } from "../tabs/Tabs.factory";
import { MockedTabsRepo } from "../tabs/MockedTabs.repo";
import { InjectionResult } from "../scripts/Scripts.repo-abstraction";
import { MockedScriptsRepo } from "../scripts/MockedScripts.repo";
import { NetflixEpisodeInfo } from "../../../main/contentScripts/NetflixEpisodeMessageHandler.service";

/**
 * Repos and services
 */
const mockedTabsRepo = new MockedTabsRepo();
const mockedScriptsRepo = new MockedScriptsRepo();

const {
  get1stEpisodeTabAndInfo,
  findOneEpisodeTab,
  findOneEpisodeTabWithSamePathAsUrl: findOneEpisodeTabByUrl,
  trySettingTime: setTime,
} = new EpisodeService({
  tabsRepo: mockedTabsRepo,
  scriptsRepo: mockedScriptsRepo,
});

const { generateEpisodeTab } = new TabsFactory();

/**
 * Other common utils
 */
type Tab = chrome.tabs.Tab;

const mockTabWithEpisode = (): Tab => {
  const tab: Tab = generateEpisodeTab();
  mockedTabsRepo.query.mockResolvedValue([tab]);
  return tab;
};

const mockNoTabs = (): void => {
  // We pretend that there are no tabs
  mockedTabsRepo.query.mockResolvedValue([]);
};

const createTabWithUrl = (url: string): Tab => {
  const tab: Tab = generateEpisodeTab();
  tab.url = url;
  return tab;
};

afterEach(() => {
  jest.resetAllMocks();
});

describe("findOneEpisodeTab", () => {
  describe("After calling it", () => {
    let mockedTab: Tab;
    let foundTab: PossibleTab;

    beforeEach(async () => {
      mockedTab = mockTabWithEpisode();
      foundTab = await findOneEpisodeTab();
    });

    it("Returns a tab", () => {
      expect(foundTab).toEqual(mockedTab);
    });

    /**
     * This is important because if we use the wrong query, we'll need extra
     * permissions.
     */
    it("Queries the tabs repo for active tabs", () => {
      expect(mockedTabsRepo.query).toBeCalledWith({
        active: true,
        lastFocusedWindow: true,
      });
    });
  });

  describe("When it does not have an episode URL", () => {
    const getActiveTab = (): Tab => {
      const episodeTab: Tab = generateEpisodeTab();
      // So that it doesn't have an episode's URL.
      episodeTab.url = "https://not-an-episode-tab.com";
      return episodeTab;
    };

    const mockActiveTab = (): void => {
      const tab: Tab = getActiveTab();
      mockedTabsRepo.query.mockResolvedValue([tab]);
    };

    beforeAll(() => {
      mockActiveTab();
    });

    it("Does not return an active tab", async () => {
      const tab: PossibleTab = await findOneEpisodeTab();
      expect(tab).toBeNull();
    });
  });
});

describe("getTimeOf1stEpisodeTab", () => {
  const callMethodAndExpectError = async (): Promise<void> => {
    const promise: Promise<EpisodeTabAndInfo> = get1stEpisodeTabAndInfo();
    await expect(promise).rejects.toBeTruthy();
  };

  describe("When the content script responds with the time", () => {
    let mockedEpisodeTime: EpisodeTime;

    const mockTimeResponse = (): EpisodeTime => {
      const mockedEpisodeTime: EpisodeTime = 1000;
      const episodeInfo: NetflixEpisodeInfo = {
        timeMs: mockedEpisodeTime,
        episodeName: null,
      };
      // TODO: Improve type for sendMessage. Maybe this mock should have types
      // by default. Furthermore, maybe the actual sendMessage func should have
      // a return type by default.
      mockedTabsRepo.sendMessage.mockResolvedValue(episodeInfo);
      return mockedEpisodeTime;
    };

    beforeAll(() => {
      mockTabWithEpisode();
      mockedEpisodeTime = mockTimeResponse();
    });

    it("Returns the episode's time", async () => {
      const { info }: EpisodeTabAndInfo = await get1stEpisodeTabAndInfo();
      expect(info.timeMs).toEqual(mockedEpisodeTime);
    });
  });

  it("Throws an error when the content script does not respond with a time", async () => {
    mockTabWithEpisode();
    mockedTabsRepo.sendMessage.mockResolvedValue(null);
    await callMethodAndExpectError();
  });

  it("Throws an error when we try returning the time when there is no Netflix tab open", async () => {
    mockNoTabs();
    await callMethodAndExpectError();
  });
});

describe("findOneEpisodeTabWithSamePathAsUrl", () => {
  describe("Even when there are multiple episode tabs", () => {
    let tabToFind: Tab;

    const getTabs = (): Tab[] => {
      tabToFind = generateEpisodeTab();
      const tabWithOtherUrl: Tab = createTabWithUrl("http://example.com");
      return [tabWithOtherUrl, tabToFind];
    };

    beforeAll(() => {
      const tabs: Tab[] = getTabs();
      mockedTabsRepo.query.mockResolvedValue(tabs);
    });

    it("Returns the episode tab with the URL", async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tab: PossibleTab = await findOneEpisodeTabByUrl(tabToFind.url!);
      expect(tab).toEqual(tabToFind);
    });
  });

  describe("When the query params don't match, but everything else does", () => {
    let tab: Tab;

    const createTabUrlWithTimeParam = (timeMs: number): string => {
      const urlInstance = new URL("https://netflix.com/watch/234");
      urlInstance.searchParams.append("t", timeMs.toString());
      return urlInstance.href;
    };

    const createTab = (): void => {
      const url: string = createTabUrlWithTimeParam(1000);
      tab = createTabWithUrl(url);
    };

    const tryFindingTabWithUrlWithOtherParams = (): Promise<PossibleTab> => {
      const urlWithOtherParams: string = createTabUrlWithTimeParam(2);
      return findOneEpisodeTabByUrl(urlWithOtherParams);
    };

    beforeAll(() => {
      createTab();
      mockedTabsRepo.query.mockResolvedValue([tab]);
    });

    it("Returns an episode tab", async () => {
      const foundTab: PossibleTab = await tryFindingTabWithUrlWithOtherParams();
      expect(foundTab).toEqual(tab);
    });
  });

  describe("When they are the same URLs, but one of them has a trailing slash", () => {
    let tab: Tab;
    const withoutTrailingSlash = `http://www.netflix.com/watch/123`;

    beforeAll(() => {
      tab = createTabWithUrl(withoutTrailingSlash);
      mockedTabsRepo.query.mockResolvedValue([tab]);
    });

    it("Returns an episode tab", async () => {
      const foundTab: PossibleTab = await findOneEpisodeTabByUrl(
        `${withoutTrailingSlash}/`
      );
      expect(foundTab).toEqual(tab);
    });
  });

  /**
   * Because tabs that aren't committed might have empty URLs. Otherwise, we
   * might get an error if the user opens the popup in a tab that is not committed.
   */
  it("Does not throw an error when one of the tabs has an empty URL", async () => {
    const tab: Tab = createTabWithUrl("");
    mockedTabsRepo.query.mockResolvedValue([tab]);
    await findOneEpisodeTabByUrl("https://example.com");
  });
});

describe("trySettingTime", () => {
  /**
   * Other test utils.
   */

  const callMethodAndExpectSuccessStatus = async (
    isSuccessful: ResultOfSettingTime["success"]
  ): Promise<void> => {
    const { success }: ResultOfSettingTime = await setTime(1);
    expect(success).toEqual(isSuccessful);
  };

  const callMethodAndExpectFailure = async (): Promise<void> => {
    await callMethodAndExpectSuccessStatus(false);
  };

  const createInjectionResult = (
    success: ResultOfSettingTime["success"]
  ): InjectionResult => {
    const result: ResultOfSettingTime = { success };
    return { frameId: 1, documentId: "", result };
  };

  it.todo("Runs it against the main window");

  it.todo("Runs the script against the correct tab");

  /**
   * To test this, we might be able to execute the function against a custom
   * context. The context should have a mocked variable called "netflix". We
   * should mock its methods and test that the correct methods get called.
   */
  it.todo("Passes a function that sets the time correctly");

  it.todo("Passes the correct args to the function that we will inject");

  describe("When all injection results return a success status", () => {
    const mockSuccessfulStatus = (): void => {
      const result: InjectionResult = createInjectionResult(true);
      mockedScriptsRepo.executeScript.mockResolvedValue([result]);
    };

    beforeAll(() => {
      mockTabWithEpisode();
      mockSuccessfulStatus();
    });

    it('Returns an object with "success" as true', async () => {
      await callMethodAndExpectSuccessStatus(true);
    });
  });

  describe("When at least one injection result does not return a successful status", () => {
    const createInjectionResults = (): InjectionResult[] => {
      const successful: InjectionResult = createInjectionResult(true);
      const unsuccessful: InjectionResult = createInjectionResult(false);
      return [successful, unsuccessful];
    };

    const mockUnsuccessfulStatus = (): void => {
      const results: InjectionResult[] = createInjectionResults();
      mockedScriptsRepo.executeScript.mockResolvedValue(results);
    };

    beforeAll(() => {
      mockTabWithEpisode();
      mockUnsuccessfulStatus();
    });

    it('Returns an object with "success" as false', async () => {
      await callMethodAndExpectFailure();
    });
  });

  describe("When executing the script does not return any injection results", () => {
    beforeAll(() => {
      mockTabWithEpisode();
      mockedScriptsRepo.executeScript.mockResolvedValue([]);
    });

    it('Returns an object with "success" as false', async () => {
      await callMethodAndExpectFailure();
    });
  });
});

it.todo(
  "Opens a new tab when clicking a bookmark when the current tab is not the bookmark's tab, even if a bookmark tab is open"
);

it.todo(
  "Set the video's time on the current, focused tab even if there are other bookmark tabs"
);
