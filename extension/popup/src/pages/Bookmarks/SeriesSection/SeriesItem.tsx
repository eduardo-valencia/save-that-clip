import React from "react";
import ResourceItem from "../../../components/ResourceItem";
import { Pages } from "../../pages";
import { defaultSeriesName } from "../../../seriesInfo/seriesConfig";
import { PossibleSeriesName } from "../../../seriesInfo/SeriesInfo.service";
import LinkWithoutStyles from "../../../components/LinkWithoutStyles";
import { Typography } from "@mui/material";
import Folder from "@mui/icons-material/Folder";

interface Props {
  possibleName: PossibleSeriesName;
}

export default function SeriesItem({ possibleName }: Props) {
  const getLink = (): string => {
    const pageId: string = possibleName ? possibleName : "null";
    // Because the series's name might have special chars.
    const encodedPageId: string = encodeURIComponent(pageId);
    return `${Pages.series}/${encodedPageId}`;
  };

  const link: string = getLink();
  return (
    <ResourceItem>
      <LinkWithoutStyles
        to={link}
        style={{ display: "flex", alignItems: "center" }}
      >
        <Folder sx={{ marginRight: "0.75rem", color: "#65676E" }} />
        <Typography component="h2" variant="button" color="textPrimary">
          {possibleName || defaultSeriesName}
        </Typography>
      </LinkWithoutStyles>
    </ResourceItem>
  );
}
