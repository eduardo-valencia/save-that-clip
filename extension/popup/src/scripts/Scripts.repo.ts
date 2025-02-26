import { getChrome } from "../../../main/common/chrome.service";
import { ScriptsRepoAbstraction } from "./Scripts.repo-abstraction";

export class ScriptsRepo extends ScriptsRepoAbstraction {
  private chrome = getChrome();

  /**
   * For info about injection results, see https://developer.chrome.com/blog/crx-scripting-api#script_injection_results
   */
  public executeScript = this.chrome.scripting.executeScript;
}
