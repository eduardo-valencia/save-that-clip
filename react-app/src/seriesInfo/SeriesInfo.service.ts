import axios, { AxiosResponse } from "axios";
import _ from "lodash";

export type SeriesName = string | null;

type ElementMatch = Element | null;

export class SeriesInfoService {
  private httpRepo = axios;

  // todo: make this throw an error if it cannot find it so we know why it fails
  // if it ever fails
  private parseJsonStringAndGetTitle = (metadata: string): SeriesName => {
    const parsedMetadata: unknown = JSON.parse(metadata);
    return _.get(parsedMetadata, "name", null);
  };

  // todo: handle possibility of this throwing an error because it might not be HTML
  private parseHtml = (html: string): Document => {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  };

  private parseHtmlAndFindMetadataElement = (html: string): ElementMatch => {
    const document: Document = this.parseHtml(html);
    return document.querySelector('script[type="application/ld+json"]');
  };

  private getTitleFromHtml = (html: string): SeriesName => {
    const metadataElement: ElementMatch =
      this.parseHtmlAndFindMetadataElement(html);
    if (!metadataElement) return null;
    // Because the inner HTML is the JSON metadata
    return this.parseJsonStringAndGetTitle(metadataElement.innerHTML);
  };

  private handleNonStringResponseData = (): never => {
    throw new Error("Response data is not a string.");
  };

  public getSeriesName = async (episodeUrl: string): Promise<SeriesName> => {
    const response: AxiosResponse = await this.httpRepo.get(episodeUrl);
    if (typeof response.data !== "string") this.handleNonStringResponseData();
    return this.getTitleFromHtml(response.data as string);
  };
}
