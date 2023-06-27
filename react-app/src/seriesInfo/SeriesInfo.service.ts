import axios, { AxiosInstance, AxiosResponse } from "axios";
import _ from "lodash";
import config from "../config";

export type SeriesName = string;

type ElementMatch = Element | null;

interface Options {
  httpRepo?: AxiosInstance;
}

type EpisodeUrl = string;

export class SeriesInfoService {
  private httpRepo;

  constructor(options: Options = {}) {
    this.httpRepo = options.httpRepo || axios;
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

  private joinPathNameOfApiAndEpisodeUrls = (
    apiUrl: URL,
    episodeUrl: URL
  ): string => {
    if (apiUrl.pathname === "/") return episodeUrl.pathname;
    return `${apiUrl.pathname}${episodeUrl.pathname}`;
  };

  /**
   * We must make a request to our API because it will forward the request to
   * Netflix. This is necessary to avoid running into CORS issues.
   */
  private convertNetflixUrlToApiUrl = (
    episodeUrlString: EpisodeUrl
  ): string => {
    const apiUrl = new URL(config.apiUrl);
    const episodeUrl = new URL(episodeUrlString);
    apiUrl.pathname = this.joinPathNameOfApiAndEpisodeUrls(apiUrl, episodeUrl);
    return apiUrl.toString();
  };

  /**
   * ! Important
   * This throws an error when it cannot find the series' name.
   */
  public getSeriesName = async (
    episodeUrl: EpisodeUrl
  ): Promise<SeriesName> => {
    const convertedUrl: string = this.convertNetflixUrlToApiUrl(episodeUrl);
    const response: AxiosResponse = await this.httpRepo.get(convertedUrl);
    if (typeof response.data !== "string") this.handleNonStringResponseData();
    return this.getTitleFromHtml(response.data as string);
  };
}
