/**
 * We must return this from a function so we can mock it.
 */
export const getChrome = (): typeof chrome => {
  return chrome;
};
