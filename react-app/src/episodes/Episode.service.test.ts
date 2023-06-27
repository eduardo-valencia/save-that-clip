import { EpisodeTime } from "../../../common/messages";
import { TabsRepo } from "../tabs/Tabs.repo";
import { TabsRepoAbstraction } from "../tabs/Tabs.repo-abstraction";
import { EpisodeService } from "./episode.service";

class CustomTabsRepo extends TabsRepoAbstraction {
  public sendMessage: jest.MockedFn<TabsRepoAbstraction["sendMessage"]> =
    jest.fn();

  public query: jest.MockedFn<TabsRepoAbstraction["query"]> = jest.fn();
}

const tabsRepo = new CustomTabsRepo();

const service = new EpisodeService({ tabsRepo });

type Tab = chrome.tabs.Tab;

const addTabWithEpisode = (): void => {
  tabsRepo.query.
}

describe("findEpisodeTime", () => {
  /**
   * - Mock the repo to return one active Netflix tab that has an episode's URL.
   *   We might need to refactor this because we'll likely need this
   *   functionality for sendMessageToSetEpisodeTime.
   * - Mock the messaging functionality to respond with the episode's time
   */
  describe("When the content script responds with the time", () => {
    it.todo("Returns the episode's time");

    it.todo('Queries the tabs with the correct args')
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

describe("findOneNetflixEpisodeTab", () => {
  it.todo("Returns a tab");
});

// todo: Note that we might not use this directly, so maybe we shouldn't test it
describe("findOneNetflixEpisodeTabByEpisodeUrl", () => {
  it.todo("Returns a tab when a tab has the episode's URL");
});
