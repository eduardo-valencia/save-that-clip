export abstract class RuntimeMessageRepoAbstraction {
  abstract sendMessage: (data: unknown) => Promise<unknown>;
}
