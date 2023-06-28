/* eslint-disable import/first */
import { StoredItems, getMockedChromeService } from "./storageMock";

jest.mock("../chrome.service", () => {
  return getMockedChromeService();
});

import { BookmarksRepo } from "./Bookmarks.repo";
import { FieldsToCreateBookmark } from "./Bookmarks.repo-abstraction";
import { Bookmark } from "./Bookmarks.service";
import { getChrome } from "../chrome.service";
import _ from "lodash";

const { create, destroy } = new BookmarksRepo();
const chrome = getChrome();

const generateUniqueBookmark = async (): Promise<FieldsToCreateBookmark> => {
  const bookmark: FieldsToCreateBookmark = { episodeUrl: _.uniqueId() };
  await create(bookmark);
  return bookmark;
};

// const createBookmarkAndExpectToFindIt = async (): Promise<void> => {

// }

describe("create", () => {
  describe("After adding a bookmark", () => {
    let bookmark: FieldsToCreateBookmark;

    beforeAll(async () => {
      bookmark = await generateUniqueBookmark();
    });

    /**
     * Plan:
     *
     * - Mock chrome.storage.set with jest.fn()
     * - Mock it to respond with a promise with an empty value
     *
     * In the test:
     *
     * - Call the method
     * - Expect chrome.storage.local.set to have been called with an object where
     *   the key is the ID and the value is the bookmark.
     *
     * todo:
     *
     * - Consider mocking chrome.storage globally because we could mock that
     *   instead of mocking the repo when we create the service's tests.
     *
     */
    it("Adds a bookmark to storage", async () => {
      // We must assert this type because Chrome's types are incorrect.
      const storageKey = null as unknown as string;
      const allItems: StoredItems = await chrome.storage.local.get(storageKey);
      const bookmarks = Object.values(allItems) as Bookmark[];
      expect(bookmarks).toContainEqual(bookmark);
    });
  });
});

// todo: remove find method because that should go in service. use list method instead.
describe("find", () => {
  describe("After creating a bookmark", () => {
    it.todo("Returns a created bookmark");
  });
});

describe("destroy", () => {
  describe("After creating a bookmark", () => {
    it.todo("Removes a bookmark");
  });
});
