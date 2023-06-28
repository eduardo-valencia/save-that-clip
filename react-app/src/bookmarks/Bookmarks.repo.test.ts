/* eslint-disable import/first */
import { getMockedChromeService } from "./storageMock";

jest.mock("../chrome.service", () => {
  return getMockedChromeService();
});

import { BookmarksRepo } from "./Bookmarks.repo";
import { FieldsToCreateBookmark as CreationFields } from "./Bookmarks.repo-abstraction";
import { Bookmark } from "./Bookmarks.service";
import _ from "lodash";

const { create, destroy, list } = new BookmarksRepo();

const generateUniqueBookmark = async (): Promise<CreationFields> => {
  const bookmark: CreationFields = { episodeUrl: _.uniqueId() };
  await create(bookmark);
  return bookmark;
};

// const getExpectedBookmarkStructure = () => {

// }

const expectToFindBookmark = (
  creationFields: CreationFields,
  bookmarks: Bookmark[]
): void => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const bookmark = expect.objectContaining(creationFields);
  expect(bookmarks).toContainEqual(bookmark);
};

const createBookmarkAndExpectToFindIt = async (): Promise<void> => {
  const creationFields: CreationFields = await generateUniqueBookmark();
  const bookmarks: Bookmark[] = await list();
  expectToFindBookmark(creationFields, bookmarks);
};

describe("create", () => {
  it("Adds a bookmark to storage", async () => {
    await createBookmarkAndExpectToFindIt();
  });
});

// todo: remove find method because that should go in service. use list method
// instead.
// todo: test that bookmarks have IDs
describe("list", () => {
  it("Lists bookmark", async () => {
    await createBookmarkAndExpectToFindIt();
  });
});

// todo: consider testing this through the service.
describe("destroy", () => {
  describe("After creating a bookmark", () => {
    it.todo("Removes a bookmark");
  });
});
