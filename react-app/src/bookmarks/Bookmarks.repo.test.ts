/* eslint-disable import/first */
import { getMockedChromeService } from "./storageMock";

jest.mock("../chrome.service", () => {
  return getMockedChromeService();
});

import { BookmarksRepo } from "./Bookmarks.repo";
import {
  Bookmark,
  RepoFieldsToCreateBookmark as CreationFields,
} from "./Bookmarks.repo-abstraction";
import _ from "lodash";

const { create, list } = new BookmarksRepo();

const generateBookmarkFields = (): CreationFields => {
  return {
    episodeUrl: _.uniqueId(),
    name: "test",
    seriesName: "test",
    timeMs: 100,
  };
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
  const creationFields: CreationFields = generateBookmarkFields();
  await create(creationFields);
  const bookmarks: Bookmark[] = await list();
  findAndValidateBookmark(creationFields, bookmarks);
};

describe("create", () => {
  it("Returns the bookmark", async () => {
    const creationFields: CreationFields = generateBookmarkFields();
    const bookmark: Bookmark = await create(creationFields);
    expect(bookmark).toMatchObject(creationFields);
    expect(bookmark.id).toBeTruthy();
  });

  it("Adds a bookmark to storage", async () => {
    await createBookmarkAndExpectToFindIt();
  });
});

describe("list", () => {
  it("Lists bookmarks", async () => {
    await createBookmarkAndExpectToFindIt();
  });
});
