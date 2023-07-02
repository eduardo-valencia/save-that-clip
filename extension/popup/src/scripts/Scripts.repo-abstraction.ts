type ExecuteScript = typeof chrome.scripting.executeScript;

type ExecuteScriptOptions = Parameters<ExecuteScript>[0];

export type InjectionResult = chrome.scripting.InjectionResult;

export abstract class ScriptsRepoAbstraction {
  abstract executeScript: (
    fields: ExecuteScriptOptions
  ) => Promise<InjectionResult[]>;
}
