import axios, { AxiosInstance, AxiosResponse } from "axios";
import { SeriesName, SeriesInfoService } from "./SeriesInfo.service";
import config from "../config";

describe("When Axios returns Netflix's HTML", () => {
  let service: SeriesInfoService;
  const episodeName = "Demon Slayer: Kimetsu no Yaiba";
  const episodeUrl = "http://netflix.com/watch/81091396";

  const getMockedHtml = (): string => {
    return `
    <script type="application/ld+json">
    {"name": "${episodeName}"}
    </script>
    `;
  };

  type Html = string;

  const getMockedResponseInfo = () => {
    type MockedResponseData = Pick<AxiosResponse, "status" | "data">;
    const html: Html = getMockedHtml();
    return { status: 200, data: html } as MockedResponseData as AxiosResponse;
  };

  const convertNetflixUrlToApiUrl = (): string => {
    const netflixUrl = new URL(episodeUrl);
    const apiUrl = new URL(config.apiUrl);
    netflixUrl.host = apiUrl.host;
    return netflixUrl.toString();
  };

  const sendResponse: AxiosInstance["get"] = async <Data, Response>(
    url: string
    // eslint-disable-next-line @typescript-eslint/require-await
  ): Promise<Response> => {
    const convertedUrl: string = convertNetflixUrlToApiUrl();
    if (url !== convertedUrl) throw new Error("Url is invalid");
    return getMockedResponseInfo();
  };

  const mockResponseOfGetMethod = (axiosInstance: AxiosInstance): void => {
    const spiedGet = jest.spyOn(axiosInstance, "get");
    spiedGet.mockImplementation(sendResponse);
  };

  const mockAxios = (): AxiosInstance => {
    const axiosInstance: AxiosInstance = axios.create();
    mockResponseOfGetMethod(axiosInstance);
    return axiosInstance;
  };

  beforeAll(() => {
    service = new SeriesInfoService({ httpRepo: mockAxios() });
  });

  it("Returns the series's name", async () => {
    const info: SeriesName = await service.getSeriesName(episodeUrl);
    expect(info).toEqual(episodeName);
  });
});

/**
 * We don't need to make these tests now because we only need to throw errors
 * for logging purposes.
 */
it.todo("Throws an error when it cannot get the name from the HTML");

it.todo("Throws an error when it cannot parse the metadata's JSON");

it.todo("Throws an error when it cannot parse the HTML");

it.todo("Throws an error when the request fails");
