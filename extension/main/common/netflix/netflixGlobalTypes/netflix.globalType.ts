import { AppContextState } from "./netflix.appContextState.types";
import { PlayerApp } from "./netflix.playerApp.types";

interface AppContext {
  getPlayerApp: () => PlayerApp;
  state: AppContextState;
}

export interface Netflix {
  appContext: AppContext;
}
