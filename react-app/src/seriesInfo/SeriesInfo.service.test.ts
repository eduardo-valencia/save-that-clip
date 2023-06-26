import axios, { AxiosInstance, AxiosResponse } from "axios";
import { SeriesName, SeriesInfoService } from "./SeriesInfo.service";
import config from "../config";

describe("When Axios returns Netflix's HTML", () => {
  let service: SeriesInfoService;
  let spiedGet: jest.SpiedFunction<AxiosInstance["get"]>;
  const episodeName = "Demon Slayer: Kimetsu no Yaiba";
  const episodeUrl = "http://netflix.com/watch/81091396";

  const getMockedHtml = (): string => {
    return `
    <script type="application/ld+json">
    {"name": "${episodeName}"}
    </script>
    `;
  };

  const getMockedResponseInfo = () => {
    type MockedResponseData = Pick<AxiosResponse, "status" | "data">;
    const html: string = getMockedHtml();
    return { status: 200, data: html } as MockedResponseData as AxiosResponse;
  };

  const convertNetflixUrlToApiUrl = (): string => {
    const netflixUrlInstance = new URL(episodeUrl);
    /**
     * We must use URL class instead of simply replacing the text in the
     * episode's URL because the config's apiUrl might have a trailing slash.
     */
    const apiUrlInstance = new URL(config.apiUrl);
    netflixUrlInstance.host = apiUrlInstance.host;
    return netflixUrlInstance.toString();
  };

  const mockResponseOfGetMethod = (axiosInstance: AxiosInstance): void => {
    spiedGet = jest.spyOn(axiosInstance, "get");
    const response: AxiosResponse = getMockedResponseInfo();
    spiedGet.mockResolvedValue(response);
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

  /**
   * Otherwise, we'll run into CORS issues.
   */
  it("Requests our API instead of Netflix", () => {
    const expectedUrl: string = convertNetflixUrlToApiUrl();
    const [url] = spiedGet.mock.lastCall;
    expect(url).toEqual(expectedUrl);
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
