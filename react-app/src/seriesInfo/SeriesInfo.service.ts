import axios from "axios";

export interface SeriesInfo {
  name: string;
}

export class SeriesInfoService {
  private httpRepo = axios;

  public getSeriesInfo = async (episodeUrl: string): Promise<SeriesInfo> => {
    // const { data } = await this.httpRepo.get(episodeUrl)
    return { name: "" };
  };
}
