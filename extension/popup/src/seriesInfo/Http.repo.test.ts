/**
 * ! Important
 *
 * We are mocking window.fetch before all tests.
 */

import { HttpRepo } from "./Http.repo";

const { fetch } = new HttpRepo();

beforeAll(() => {
  window.fetch = jest.fn();
});

it("Makes a request", async () => {
  await fetch("http://example.com", {});
});

/**
 * If we set the fetch method to window.fetch, that would cause an illegal
 * invocation error.
 */
it("Does not bind window.fetch to the repo", () => {
  expect(fetch).not.toEqual(window.fetch);
});
