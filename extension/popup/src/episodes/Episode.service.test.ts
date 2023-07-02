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
  EpisodeTabAndTime,
  PossibleTab,
  ScriptResult,
} from "./Episode.service";
import { TabsFactory } from "../tabs/Tabs.factory";
import { MockedTabsRepo } from "../tabs/MockedTabs.repo";
import { InjectionResult } from "../scripts/Scripts.repo-abstraction";
import { MockedScriptsRepo } from "../scripts/MockedScripts.repo";

/**
 * Repos and services
 */
const mockedTabsRepo = new MockedTabsRepo();
const mockedScriptsRepo = new MockedScriptsRepo();

const {
  get1stEpisodeTabAndTime: findTimeOf1stEpisodeTab,
  findOneEpisodeTab,
  findOneEpisodeTabByUrl,
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

const mockTimeResponse = (): EpisodeTime => {
  const mockedEpisodeTime: EpisodeTime = 1000;
  mockedTabsRepo.sendMessage.mockResolvedValue(mockedEpisodeTime);
  return mockedEpisodeTime;
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
    const promise: Promise<EpisodeTabAndTime> = findTimeOf1stEpisodeTab();
    await expect(promise).rejects.toBeTruthy();
  };

  describe("When the content script responds with the time", () => {
    let mockedEpisodeTime: EpisodeTime;

    beforeAll(() => {
      mockTabWithEpisode();
      mockedEpisodeTime = mockTimeResponse();
    });

    it("Returns the episode's time", async () => {
      const { time }: EpisodeTabAndTime = await findTimeOf1stEpisodeTab();
      expect(time).toEqual(mockedEpisodeTime);
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

describe("findOneEpisodeTabByUrl", () => {
  describe("Even when there are multiple episode tabs", () => {
    let tabToFind: Tab;

    const generateTabWithOtherUrl = (): Tab => {
      const tab: Tab = generateEpisodeTab();
      tab.url = "http://example.com";
      return tab;
    };

    const getTabs = (): Tab[] => {
      tabToFind = generateEpisodeTab();
      const tabWithOtherUrl: Tab = generateTabWithOtherUrl();
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
});

describe("trySettingTime", () => {
  /**
   * Other test utils.
   */

  const callMethodAndExpectSuccessStatus = async (
    isSuccessful: ScriptResult["success"]
  ): Promise<void> => {
    const { success }: ScriptResult = await setTime(1);
    expect(success).toEqual(isSuccessful);
  };

  const callMethodAndExpectFailure = async (): Promise<void> => {
    await callMethodAndExpectSuccessStatus(false);
  };

  const createInjectionResult = (
    success: ScriptResult["success"]
  ): InjectionResult => {
    const result: ScriptResult = { success };
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
      mockTimeResponse();
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
      mockTimeResponse();
      mockUnsuccessfulStatus();
    });

    it('Returns an object with "success" as false', async () => {
      await callMethodAndExpectFailure();
    });
  });

  describe("When executing the script does not return any injection results", () => {
    beforeAll(() => {
      mockTabWithEpisode();
      mockTimeResponse();
      mockedScriptsRepo.executeScript.mockResolvedValue([]);
    });

    it('Returns an object with "success" as false', async () => {
      await callMethodAndExpectFailure();
    });
  });
});
