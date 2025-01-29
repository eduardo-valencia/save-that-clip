import { captureException, captureMessage } from "@sentry/core";

export abstract class ErrorReporterRepoAbstraction {
  abstract captureException: typeof captureException;

  abstract captureMessage: typeof captureMessage;
}
