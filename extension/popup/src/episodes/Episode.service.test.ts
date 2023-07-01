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
} from "./Episode.service";
import { TabsFactory } from "../tabs/Tabs.factory";
import { MockedTabsRepo } from "../tabs/MockedTabs.repo";

/**
 * Repos and services
 */
const tabsRepo = new MockedTabsRepo();
const {
  get1stEpisodeTabAndTime: findTimeOf1stEpisodeTab,
  findOneEpisodeTab,
  sendMessageToSetEpisodeTime,
  findOneEpisodeTabByUrl,
} = new EpisodeService({ tabsRepo });
const { generateEpisodeTab } = new TabsFactory();

/**
 * Other common utils
 */
type Tab = chrome.tabs.Tab;

const mockTabWithEpisode = (): Tab => {
  const tab: Tab = generateEpisodeTab();
  tabsRepo.query.mockResolvedValue([tab]);
  return tab;
};

const mockNoTabs = (): void => {
  // We pretend that there are no tabs
  tabsRepo.query.mockResolvedValue([]);
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
      expect(tabsRepo.query).toBeCalledWith({
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
      tabsRepo.query.mockResolvedValue([tab]);
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
    const mockedEpisodeTime: EpisodeTime = 1000;

    const mockTimeResponse = (): void => {
      tabsRepo.sendMessage.mockResolvedValue(mockedEpisodeTime);
    };

    beforeAll(() => {
      mockTabWithEpisode();
      mockTimeResponse();
    });

    it("Returns the episode's time", async () => {
      const { time }: EpisodeTabAndTime = await findTimeOf1stEpisodeTab();
      expect(time).toEqual(mockedEpisodeTime);
    });
  });

  it("Throws an error when the content script does not respond with a time", async () => {
    mockTabWithEpisode();
    tabsRepo.sendMessage.mockResolvedValue(null);
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
      expect(tabsRepo.sendMessage).toHaveBeenCalledWith(tab.id, message);
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
      tabsRepo.query.mockResolvedValue(tabs);
    });

    it("Returns the episode tab with the URL", async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tab: PossibleTab = await findOneEpisodeTabByUrl(tabToFind.url!);
      expect(tab).toEqual(tabToFind);
    });
  });
});
