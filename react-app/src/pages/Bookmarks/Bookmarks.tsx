import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import PageContainer from "../../components/PageContainer";
import { SeriesInfoService } from "../../seriesInfo/SeriesInfo.service";

const service = new SeriesInfoService();

const Bookmarks = () => {
  const [response, setResponse] = useState();

  useEffect(() => {
    const episode = "http://localhost:5000/watch/81091396";
    void service.getSeriesName(episode);
  }, []);

  return (
    <PageContainer>
      <Typography variant="h1">Bookmarks</Typography>
    </PageContainer>
  );
};

export default Bookmarks;
