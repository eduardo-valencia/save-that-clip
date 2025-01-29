import _ from "lodash";
import { ErrorReporterService } from "../errorReporter/ErrorReporter.service";
import { HttpRepoAbstraction } from "./Http.repo-abstraction";
import { HttpRepo } from "./Http.repo";

export type SeriesName = string;

type ElementMatch = Element | null;

interface Options {
  httpRepo?: HttpRepoAbstraction;
}

type EpisodeUrl = string;

export type PossibleSeriesName = SeriesName | null;

export class SeriesInfoService {
  private httpRepo: HttpRepoAbstraction;
  private errorReporterService = new ErrorReporterService();

  constructor(options: Options = {}) {
    this.httpRepo = options.httpRepo || new HttpRepo();
  }

  private handleInvalidName = (metadata: string): never => {
    console.error("parsed metadata", metadata);
    throw new Error("Failed to get the name from the parsed metadata.");
  };

  private parseJsonStringAndGetTitle = (metadata: string): SeriesName => {
    const parsedMetadata: unknown = JSON.parse(metadata);
    const name: unknown = _.get(parsedMetadata, "name");
    if (typeof name !== "string") return this.handleInvalidName(metadata);
    return name;
  };

  private parseHtml = (html: string): Document => {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  };

  private parseHtmlAndFindMetadataElement = (html: string): ElementMatch => {
    const document: Document = this.parseHtml(html);
    return document.querySelector('script[type="application/ld+json"]');
  };

  private handleMissingMetadataElement = (): never => {
    throw new Error(
      "Could not find the element with the episode metadata in the HTML."
    );
  };

  private getTitleFromHtml = (html: string): SeriesName => {
    const metadataElement: ElementMatch =
      this.parseHtmlAndFindMetadataElement(html);
    if (!metadataElement) return this.handleMissingMetadataElement();
    // Because the inner HTML is the JSON metadata
    return this.parseJsonStringAndGetTitle(metadataElement.innerHTML);
  };

  private getSeriesPageHtml = async (
    episodeUrl: EpisodeUrl
  ): Promise<string> => {
    /**
     * We omit credentials so it thinks we aren't signed in and redirects us to
     * the series's page.
     */
    const response: Response = await this.httpRepo.fetch(episodeUrl, {
      credentials: "omit",
    });
    return response.text();
  };

  /**
   * ! Important This throws an error when it cannot find the series' name.
   *
   * Implementation notes:
   *
   * We don't get the series's name from the current tab because it isn't always
   * present on the page. Although it might seem that we can get the series's
   * name from the element under the video's scrubber, that element disappears
   * after a period of inactivity, so that would not work.
   */
  private getSeriesName = async (
    episodeUrl: EpisodeUrl
  ): Promise<SeriesName> => {
    const seriesHtml: string = await this.getSeriesPageHtml(episodeUrl);
    return this.getTitleFromHtml(seriesHtml);
  };

  private handleErrorGettingSeriesName = (error: unknown): null => {
    this.errorReporterService.captureExceptionAndLogError(error);
    return null;
  };

  public findSeriesName = async (
    episodeUrl: EpisodeUrl
  ): Promise<PossibleSeriesName> => {
    try {
      return await this.getSeriesName(episodeUrl);
    } catch (error) {
      return this.handleErrorGettingSeriesName(error);
    }
  };
}
