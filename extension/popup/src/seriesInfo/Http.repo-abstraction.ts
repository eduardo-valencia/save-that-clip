export abstract class HttpRepoAbstraction {
  abstract fetch: (url: string, options: RequestInit) => Promise<Response>;
}
