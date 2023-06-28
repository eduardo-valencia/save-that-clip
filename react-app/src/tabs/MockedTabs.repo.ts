import { TabsRepoAbstraction } from "./Tabs.repo-abstraction";

/**
 * We are mocking this instead of treating this like a real repo. Otherwise,
 * we'd have to add methods to add and delete tabs.
 */
export class MockedTabsRepo extends TabsRepoAbstraction {
  public sendMessage: jest.MockedFn<TabsRepoAbstraction["sendMessage"]> =
    jest.fn();

  public query: jest.MockedFn<TabsRepoAbstraction["query"]> = jest.fn();
}
