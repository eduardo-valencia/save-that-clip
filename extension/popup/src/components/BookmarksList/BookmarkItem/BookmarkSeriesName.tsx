import { Typography } from "@mui/material";
import { defaultSeriesName } from "../../../seriesInfo/seriesConfig";
import { PossibleSeriesName } from "../../../seriesInfo/SeriesInfo.service";

interface Props {
  possibleSeriesName: PossibleSeriesName;
}

export default function BookmarkSeriesName({ possibleSeriesName }: Props) {
  const getSeriesName = (): string => {
    if (possibleSeriesName) return possibleSeriesName.substring(0, 39);
    return defaultSeriesName;
  };

  const seriesName: string = getSeriesName();

  return (
    <Typography sx={{ fontSize: "0.875rem", lineHeight: "1.5rem" }}>
      {seriesName}
    </Typography>
  );
}
