import { getChrome } from "../../../main/common/chrome.service";
import { ScriptsRepoAbstraction } from "./Scripts.repo-abstraction";

export class ScriptsRepo extends ScriptsRepoAbstraction {
  private chrome = getChrome();

  public executeScript = this.chrome.scripting.executeScript;
}
