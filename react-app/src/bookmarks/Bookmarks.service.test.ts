/* eslint-disable import/first */
import { getMockedChromeService } from "./storageMock";

jest.mock("../chrome.service", () => {
  return getMockedChromeService();
});

describe("create", () => {
  describe("After calling it", () => {
    it.todo("Creates a bookmark");

    it.todo("Creates a bookmark with the series's name");

    it.todo("");
  });
});

describe("find", () => {
  it.todo("Lists bookmarks when not providing any fields");

  it.todo("Filters bookmarks by their fields");
});

describe("destroy", () => {
  it.todo("Removes a bookmark");
});
