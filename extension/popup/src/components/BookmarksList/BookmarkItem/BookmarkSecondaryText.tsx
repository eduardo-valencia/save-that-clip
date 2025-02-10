import { Typography } from "@mui/material";
import { defaultSeriesName } from "../../../seriesInfo/seriesConfig";
import { PossibleSeriesName } from "../../../seriesInfo/SeriesInfo.service";
import _ from "lodash";

interface Props {
  secondaryTxt: PossibleSeriesName;
}

export default function BookmarkSecondaryText({ secondaryTxt }: Props) {
  const shortenTxtIfNecessary = (): string => {
    if (secondaryTxt) return _.truncate(secondaryTxt, { length: 39 });
    return defaultSeriesName;
  };

  const txt: string = shortenTxtIfNecessary();

  return (
    <Typography sx={{ fontSize: "0.875rem", lineHeight: "1.5rem" }}>
      {txt}
    </Typography>
  );
}
