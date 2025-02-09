import { ScriptsRepoAbstraction } from "./Scripts.repo-abstraction";

type ExecuteScript = ScriptsRepoAbstraction["executeScript"];

export class MockedScriptsRepo extends ScriptsRepoAbstraction {
  public executeScript: jest.MockedFunction<ExecuteScript> = jest.fn();
}
