/**
 * ! Important
 *
 * We reset mocks after each test.
 */

import { EpisodeTime, PossibleEpisodeTime } from "../../../common/messages";
import { TabsRepo } from "../tabs/Tabs.repo";
import { TabsRepoAbstraction } from "../tabs/Tabs.repo-abstraction";
import { EpisodeService, PossibleTab } from "./Episode.service";

/**
 * We are mocking this instead of treating this like a real repo. Otherwise,
 * we'd have to add methods to add and delete tabs.
 */
class CustomTabsRepo extends TabsRepoAbstraction {
  public sendMessage: jest.MockedFn<TabsRepoAbstraction["sendMessage"]> =
    jest.fn();

  public query: jest.MockedFn<TabsRepoAbstraction["query"]> = jest.fn();
}

/**
 * Repos and services
 */
const tabsRepo = new CustomTabsRepo();
const { findTimeOf1stEpisodeTab, findOneEpisodeTab } = new EpisodeService({
  tabsRepo,
});

/**
 * Other common utils
 */
type Tab = chrome.tabs.Tab;

const generateEpisodeTab = () => {
  const tab: Pick<Tab, "url" | "active"> = {
    url: "http://netflix.com/watch/81091396",
    active: true,
  };
  return tab as Tab;
};

const mockTabWithEpisode = (): Tab => {
  const tab: Tab = generateEpisodeTab();
  tabsRepo.query.mockResolvedValue([tab]);
  return tab;
};

afterEach(() => {
  jest.resetAllMocks();
});

describe("findOneEpisodeTab", () => {
  it("Returns a tab", async () => {
    const mockedTab: Tab = mockTabWithEpisode();
    const tab: PossibleTab = await findOneEpisodeTab();
    expect(tab).toEqual(mockedTab);
  });

  // So the extension doesn't need extra permissions
  it("Queries the tabs repo for active tabs", async () => {
    mockTabWithEpisode();
    await findOneEpisodeTab();
    expect(tabsRepo.query).toBeCalledWith({ active: true });
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

describe("findTimeOf1stEpisodeTab", () => {
  /**
   * - Mock the repo to return one active Netflix tab that has an episode's URL.
   *   We might need to refactor this because we'll likely need this
   *   functionality for sendMessageToSetEpisodeTime.
   * - Mock the messaging functionality to respond with the episode's time
   */
  // todo: handle possibility of them having multiple active episode tabs
  describe("When the content script responds with the time", () => {
    const episodeTime: EpisodeTime = 1000;

    const mockTimeResponse = (): void => {
      tabsRepo.sendMessage.mockResolvedValue(episodeTime);
    };

    beforeAll(() => {
      mockTabWithEpisode();
      mockTimeResponse();
    });

    it("Returns the episode's time", async () => {
      const time: PossibleEpisodeTime = await findTimeOf1stEpisodeTab();
      expect(time).toEqual(episodeTime);
    });
  });

  /**
   * We must throw an error because we would only call this method when
   * attempting to create a bookmark, and we expect a Netflix tab to be open
   * already.
   */
  it.todo(
    "Throws an error when we try returning the time when there is no Netflix tab open"
  );
});

describe("sendMessageToSetEpisodeTime", () => {
  it.todo("Sends a message");
});

// todo: determine if we need to test this directly, or if we can do so indirectly
describe("findOneEpisodeTabByUrl", () => {
  it.todo("Returns a tab when a tab has the episode's URL and is active");

  it.todo("Queries with the correct args");
});
