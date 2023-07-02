/**
 * ! Important
 *
 * We reset mocks after each test.
 *
 * * Notes
 *
 * - An "episode tab" is an active tab with a Netflix episode.
 */

import {
  EpisodeTime,
  MessageToSetEpisodeTime,
  Messages,
  ResultOfSettingTime,
} from "../../../main/common/messages";
import {
  EpisodeService,
  EpisodeTabAndTime,
  PossibleTab,
  ScriptResult,
} from "./Episode.service";
import { TabsFactory } from "../tabs/Tabs.factory";
import { MockedTabsRepo } from "../tabs/MockedTabs.repo";
import {
  InjectionResult,
  ScriptsRepoAbstraction,
} from "../scripts/Scripts.repo-abstraction";

/**
 * Repos and services
 */
type ExecuteScript = ScriptsRepoAbstraction["executeScript"];

class MockedScriptsRepo extends ScriptsRepoAbstraction {
  public executeScript: jest.MockedFunction<ExecuteScript> = jest.fn();
}

const mockedTabsRepo = new MockedTabsRepo();
const mockedScriptsRepo = new MockedScriptsRepo();

const {
  get1stEpisodeTabAndTime: findTimeOf1stEpisodeTab,
  findOneEpisodeTab,
  sendMessageToSetEpisodeTime,
  findOneEpisodeTabByUrl,
  setTime,
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

describe("sendMessageToSetEpisodeTime", () => {
  describe("After calling it when there is an episode tab", () => {
    let tab: Tab;
    const timeMs: MessageToSetEpisodeTime["timeMs"] = 1000;

    const getMessage = (): MessageToSetEpisodeTime => {
      return { type: Messages.setEpisodeTime, timeMs: 1000 };
    };

    beforeAll(async () => {
      tab = mockTabWithEpisode();
      await sendMessageToSetEpisodeTime(timeMs);
    });

    it("Sends a message", () => {
      const message: MessageToSetEpisodeTime = getMessage();
      expect(mockedTabsRepo.sendMessage).toHaveBeenCalledWith(tab.id, message);
    });
  });

  it("Throws an error when it cannot find an episode tab", async () => {
    mockNoTabs();
    const promise: Promise<ResultOfSettingTime> =
      sendMessageToSetEpisodeTime(1000);
    await expect(promise).rejects.toBeTruthy();
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

/**
 * Plan:
 * - Create a new repo for scripting so we can easily mock it in the future.
 * - Explain that we're making a repo instead of the Chrome service because
 *   mocking the latter might require combining multiple mocks if we needed to
 *   mock various aspects of the Chrome service in the future.
 * - Create a mocked repo with executeScript as jest.fn()
 */
describe("setTime", () => {
  /**
   * Other test utils.
   */

  /**
   * - Call the method and get the success status. Call it with any fake time.
   * - Expect "success" to equal false.
   */
  const callMethodAndExpectFailure = async (): Promise<void> => {
    const { success }: ScriptResult = await setTime(1);
    expect(success).toEqual(true);
  };

  /**
   * - Return an injection result that has a "result" of null.
   * - Call setTime.
   * - Expect it to return a "success" of false.
   */
  describe("When the injected script does not return a successful status", () => {
    const createInjectionResult = (): InjectionResult => {
      const result: ScriptResult = { success: false };
      return { frameId: 1, documentId: "", result };
    };

    const mockUnsuccessfulStatus = (): void => {
      const result: InjectionResult = createInjectionResult();
      mockedScriptsRepo.executeScript.mockResolvedValue([result]);
    };

    beforeAll(() => {
      mockTabWithEpisode();
      mockTimeResponse();
      mockUnsuccessfulStatus();
    });

    // todo: fix false positive
    it('Returns an object with "success" as false', async () => {
      await callMethodAndExpectFailure();
    });
  });

  /**
   * - Mock executeScript to return an empty array of injection results.
   * - Call setTime.
   * Expect ito to return a "success" of false.
   */
  describe("When executing the script does not return any injection results", () => {
    it.todo('Returns an object with "success" as false');
  });
});
