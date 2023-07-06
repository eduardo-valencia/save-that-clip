/* eslint-disable import/first */
import { getMockedChromeService } from "./storageMock";

jest.mock("../../../main/common/chrome.service", () => {
  return getMockedChromeService();
});

import { BookmarksRepo } from "./Bookmarks.repo";
import {
  Bookmark,
  RepoFieldsToCreateBookmark as CreationFields,
} from "./Bookmarks.repo-abstraction";
import _ from "lodash";

const { create, list, destroy } = new BookmarksRepo();

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

const generateBookmark = async (): Promise<Bookmark> => {
  const creationFields: CreationFields = generateBookmarkFields();
  return create(creationFields);
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

  it("Can store multiple bookmarks", async () => {
    await generateBookmark();
    await generateBookmark();
    const bookmarks: Bookmark[] = await list();
    expect(bookmarks.length).toBeGreaterThanOrEqual(2);
  });
});

describe("list", () => {
  it("Lists bookmarks", async () => {
    await createBookmarkAndExpectToFindIt();
  });

  describe("When there are no bookmarks", () => {
    const destroyBookmark = async (bookmark: Bookmark): Promise<void> => {
      await destroy(bookmark.id);
    };

    const destroyAllBookmarks = async (): Promise<void> => {
      const bookmarks: Bookmark[] = await list();
      const promises: Promise<void>[] = bookmarks.map(destroyBookmark);
      await Promise.all(promises);
    };

    beforeAll(async () => {
      await destroyAllBookmarks();
    });

    it("Returns an empty array", async () => {
      const bookmarks: Bookmark[] = await list();
      expect(bookmarks).toEqual([]);
    });
  });
});

describe("destroy", () => {
  describe("When there are multiple bookmarks", () => {
    let otherBookmark: Bookmark;
    let bookmarkToDelete: Bookmark;

    beforeAll(async () => {
      otherBookmark = await generateBookmark();
      bookmarkToDelete = await generateBookmark();
    });

    it("Avoids destroying bookmarks without the same ID", async () => {
      await destroy(bookmarkToDelete.id);
      const bookmarks: Bookmark[] = await list();
      expect(bookmarks).toContain(otherBookmark);
    });
  });
});
