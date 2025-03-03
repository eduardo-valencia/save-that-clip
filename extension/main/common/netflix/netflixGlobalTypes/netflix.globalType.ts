import { AppContextState } from "./netflix.appContextState.types";
import { PlayerApp } from "./netflix.playerApp.types";

interface AppContext {
  getPlayerApp: () => PlayerApp;
  state: AppContextState;
}

/**
 * This is used in injected scripts, but it is not actually accessible
 * anywhere besides injected scripts (not even content scripts).
 */
export interface Netflix {
  appContext: AppContext;
}
