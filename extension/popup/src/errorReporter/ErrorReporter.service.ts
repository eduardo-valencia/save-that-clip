import { ErrorReporterRepoAbstraction } from "./ErrorReporter.repo-abstraction";
import * as Sentry from "@sentry/react";

export class ErrorReporterService {
  constructor(private repo: ErrorReporterRepoAbstraction = Sentry) {}

  public captureExceptionAndLogError = (error: unknown): void => {
    console.error(error);
    this.repo.captureException(error);
  };
}
