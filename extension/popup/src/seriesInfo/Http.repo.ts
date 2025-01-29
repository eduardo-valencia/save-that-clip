import { HttpRepoAbstraction } from "./Http.repo-abstraction";

export class HttpRepo extends HttpRepoAbstraction {
  public fetch = (url: string, options: RequestInit): Promise<Response> => {
    return fetch(url, options);
  };
}
