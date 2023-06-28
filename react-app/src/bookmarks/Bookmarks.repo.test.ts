/* eslint-disable import/first */
import { getMockedChromeService } from "./storageMock";

jest.mock("../chrome.service", () => {
  return getMockedChromeService();
});

import { BookmarksRepo } from "./Bookmarks.repo";
import {
  Bookmark,
  FieldsToCreateBookmark as CreationFields,
} from "./Bookmarks.repo-abstraction";
import _ from "lodash";

const { create, list } = new BookmarksRepo();

const generateUniqueBookmark = async (): Promise<CreationFields> => {
  const bookmark: CreationFields = { episodeUrl: _.uniqueId() };
  await create(bookmark);
  return bookmark;
};

const findAndValidateBookmark = (
  creationFields: CreationFields,
  bookmarks: Bookmark[]
): void => {
  const bookmark = _.find(bookmarks, creationFields) as Bookmark | undefined;
  expect(bookmark).toBeTruthy();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(bookmark!.id).toBeTruthy();
};

const createBookmarkAndExpectToFindIt = async (): Promise<void> => {
  const creationFields: CreationFields = await generateUniqueBookmark();
  const bookmarks: Bookmark[] = await list();
  findAndValidateBookmark(creationFields, bookmarks);
};

describe("create", () => {
  it("Adds a bookmark to storage", async () => {
    await createBookmarkAndExpectToFindIt();
  });
});

describe("list", () => {
  it("Lists bookmarks", async () => {
    await createBookmarkAndExpectToFindIt();
  });
});
