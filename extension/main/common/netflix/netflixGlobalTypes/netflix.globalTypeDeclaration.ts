import { AppContextState } from "./netflix.appContextState.types";
import { PlayerApp } from "./netflix.playerApp.types";

interface AppContext {
  getPlayerApp: () => PlayerApp;
  state: AppContextState;
}

interface Netflix {
  appContext: AppContext;
}

/**
 * TODO: Check if this is accidentally available outside of the file
 */
declare global {
  /**
   * This is used in injected scripts, but it is not actually accessible
   * anywhere besides injected scripts. In other words, don't use this.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const netflix: Netflix;
}
