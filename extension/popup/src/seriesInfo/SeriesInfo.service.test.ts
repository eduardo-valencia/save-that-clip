import { HttpRepoAbstraction } from "./Http.repo-abstraction";
import { SeriesInfoService, PossibleSeriesName } from "./SeriesInfo.service";

describe("When Axios returns Netflix's HTML", () => {
  let service: SeriesInfoService;

  type Fetch = typeof fetch;

  class MockedHttpRepo extends HttpRepoAbstraction {
    public fetch: jest.MockedFunction<Fetch> = jest.fn();
  }

  let mockedRepo: MockedHttpRepo;

  const episodeName = "Test";
  const episodeHref = "/watch/81091396";
  const episodeUrl = `http://netflix.com${episodeHref}`;

  const getMockedHtml = (): string => {
    return `
    <script type="application/ld+json">
    {"name": "${episodeName}"}
    </script>
    `;
  };

  const getRequestAsText = (): Promise<string> => {
    return new Promise((resolve) => {
      const html: string = getMockedHtml();
      resolve(html);
    });
  };

  const getMockedResponseInfo = () => {
    type MockedResponseData = Pick<Response, "text">;
    return { text: getRequestAsText } as MockedResponseData as Response;
  };

  const mockResponse = (): void => {
    const response: Response = getMockedResponseInfo();
    mockedRepo.fetch.mockResolvedValue(response);
  };

  const getNameForEpisode = (): Promise<PossibleSeriesName> => {
    return service.findSeriesName(episodeUrl);
  };

  beforeAll(() => {
    mockedRepo = new MockedHttpRepo();
    mockResponse();
    service = new SeriesInfoService({ httpRepo: mockedRepo });
  });

  it("Returns the series's name", async () => {
    const name: PossibleSeriesName = await getNameForEpisode();
    expect(name).toEqual(episodeName);
  });

  it("Requests the correct URL & omits credentials in the request", () => {
    expect(mockedRepo.fetch).toHaveBeenCalledWith(episodeUrl, {
      credentials: "omit",
    });
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
