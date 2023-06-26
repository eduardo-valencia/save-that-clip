import { SeriesName, SeriesInfoService } from "./SeriesInfo.service";

const service = new SeriesInfoService();

it("Returns the series's name", async () => {
  const episode = "https://www.netflix.com/watch/81091396";
  const info: SeriesName = await service.getSeriesName(episode);
  expect(info).toEqual({ name: "Demon Slayer: Kimetsu no Yaiba" });
});

it.todo(
  "Throws an error when it cannot parse the series' info from an episode's URL."
);
