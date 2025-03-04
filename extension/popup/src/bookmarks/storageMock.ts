/**
 * ! Important
 *
 * This mock does not support the entirety of chrome.storage. Please below to
 * understand what is supported. Note that callbacks are unsupported.
 */

import _ from "lodash";

type ChromeLocalStorage = typeof chrome.storage.local;

type ParametersOfGet = Parameters<ChromeLocalStorage["get"]>;

export interface StoredItems {
  [key: string]: unknown;
}

type PossibleStorageKeys = ParametersOfGet["0"] | null;

type ParametersOfRemove = Parameters<ChromeLocalStorage["remove"]>;

class LocalStorageArea {
  public items: StoredItems = {};

  private findItems = (storageKeys?: PossibleStorageKeys): StoredItems => {
    if (typeof storageKeys === "string") return _.pick(this.items, storageKeys);
    throw new Error("Filtering by non-string storage keys is unsupported.");
  };

  /**
   * Implementation notes:
   *
   * We allow null because the Chrome docs say we can use it.
   */
  public get = (storageKeys?: PossibleStorageKeys): Promise<StoredItems> => {
    return new Promise((resolve) => {
      const items: StoredItems = this.findItems(storageKeys);
      /**
       * We make a copy in case we try to mutate the stored items. If we do not copy
       * it, some tests could falsely pass if we mutate the items, but forget to
       * update them using chrome.storage.
       *
       * Note that _.assign does not work.
       */
      const itemsCopy: StoredItems = _.merge({}, items);
      resolve(itemsCopy);
    });
  };

  public set = (items: StoredItems): Promise<void> => {
    return new Promise((resolve) => {
      this.items = { ...this.items, ...items };
      resolve();
    });
  };

  public remove = (keys: ParametersOfRemove["0"]): Promise<void> => {
    return new Promise((resolve) => {
      this.items = _.omit(this.items, keys);
      resolve();
    });
  };
}

/**
 * We must place this outside of the functions to that it isn't regenerated each
 * time we get mocked Chrome.
 */
const localStorage = new LocalStorageArea();

const getMockedChrome = () => {
  const storageMock = { local: localStorage };
  const storageWithType = storageMock as unknown as typeof chrome.storage;
  return { storage: storageWithType } as typeof chrome;
};

export const getMockedChromeService = () => {
  return { getChrome: getMockedChrome };
};
