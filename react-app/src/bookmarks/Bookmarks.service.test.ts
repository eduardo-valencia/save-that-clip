/* eslint-disable import/first */
import { getMockedChromeService } from "./storageMock";

jest.mock("../chrome.service", () => {
  return getMockedChromeService();
});

/**
 * * General plan:
 *
 * - Mock the episode service so we can mock the time.
 * - Mock the series info service so we can mock the series' name.
 */

describe("create", () => {
  /**
   * Plan:
   * - Mock the episode service to return a specific time.
   * - Mock the series' info service to return a specific series name.
   * - Call the method to create a bookmark. Call it with only a name.
   * - Define a method to get the expected fields.
   * - Expect the bookmark to have the expected fields.
   */
  describe("After calling it", () => {
    it.todo("Creates a bookmark");

    it.todo("Creates a bookmark with the provided fields");

    it.todo("Creates a bookmark with the series's name");

    it.todo("Creates a bookmark with the episode's time");
  });
});

describe("find", () => {
  it.todo("Lists bookmarks when not providing any fields");

  it.todo("Filters bookmarks by their fields");
});

describe("destroy", () => {
  it.todo("Removes a bookmark");
});
