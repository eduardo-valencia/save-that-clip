import { captureException } from "@sentry/core";

export abstract class ErrorReporterRepoAbstraction {
  abstract captureException: typeof captureException;
}
