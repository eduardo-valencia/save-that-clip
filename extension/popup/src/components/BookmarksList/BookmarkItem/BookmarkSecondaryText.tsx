import { Typography } from "@mui/material";
import { defaultSeriesName } from "../../../seriesInfo/seriesConfig";
import { PossibleSeriesName } from "../../../seriesInfo/SeriesInfo.service";

interface Props {
  secondaryTxt: PossibleSeriesName;
}

export default function BookmarkSecondaryText({ secondaryTxt }: Props) {
  const shortenTxtIfNecessary = (): string => {
    if (secondaryTxt) return secondaryTxt.substring(0, 39);
    return defaultSeriesName;
  };

  const txt: string = shortenTxtIfNecessary();

  return (
    <Typography sx={{ fontSize: "0.875rem", lineHeight: "1.5rem" }}>
      {txt}
    </Typography>
  );
}
