import { TabsRepoAbstraction } from "./Tabs.repo-abstraction";

/**
 * TODO: Make this actually store tabs
 */
export class MockedTabsRepo extends TabsRepoAbstraction {
  public sendMessage: jest.MockedFn<TabsRepoAbstraction["sendMessage"]> =
    jest.fn();

  public query: jest.MockedFn<TabsRepoAbstraction["query"]> = jest.fn();

  public create: jest.MockedFn<TabsRepoAbstraction["create"]> = jest.fn();

  public remove: jest.MockedFn<TabsRepoAbstraction["remove"]> = jest.fn();
}
