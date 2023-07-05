import _ from "lodash";
import { ErrorReporterService } from "../errorReporter/ErrorReporter.service";

export type SeriesName = string;

type ElementMatch = Element | null;

interface Options {
  fetch?: typeof fetch;
}

type EpisodeUrl = string;

export type PossibleSeriesName = SeriesName | null;

export class SeriesInfoService {
  private fetch;
  private errorReporterService = new ErrorReporterService();

  constructor(options: Options = {}) {
    this.fetch = options.fetch || fetch;
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

  private handleNonStringResponseData = (): never => {
    throw new Error("Response data is not a string.");
  };

  /**
   * ! Important
   * This throws an error when it cannot find the series' name.
   */
  private getSeriesName = async (
    episodeUrl: EpisodeUrl
  ): Promise<SeriesName> => {
    /**
     * We omit credentials so it thinks we aren't signed in and redirects us to
     * the series's page.
     */
    const response = await this.fetch(episodeUrl, { credentials: "omit" });
    const textData: string = await response.text();
    if (typeof textData !== "string") this.handleNonStringResponseData();
    return this.getTitleFromHtml(textData);
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
