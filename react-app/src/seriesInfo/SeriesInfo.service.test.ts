import axios, { AxiosInstance, AxiosResponse } from "axios";
import { SeriesName, SeriesInfoService } from "./SeriesInfo.service";

describe("When Axios returns Netflix's HTML", () => {
  let service: SeriesInfoService;
  const episodeName = "Demon Slayer: Kimetsu no Yaiba";

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

  const mockResponseOfGetMethod = (axiosInstance: AxiosInstance): void => {
    const spiedGet = jest.spyOn(axiosInstance, "get");
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
    const episode = "http://localhost:5000/watch/81091396";
    const info: SeriesName = await service.getSeriesName(episode);
    expect(info).toEqual(episodeName);
  });
});

it.todo("Throws an error when it cannot get the name from the HTML");

it.todo("Throws an error when it cannot parse the metadata's JSON");

it.todo("Throws an error when it cannot parse the HTML");

it.todo("Throws an error when the request fails");
