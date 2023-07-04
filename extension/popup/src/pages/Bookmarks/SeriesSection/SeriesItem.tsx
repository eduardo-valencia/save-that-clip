import React from "react";
import ResourceItem from "../../../components/ResourceItem";
import { Link } from "react-router-dom";
import { Pages } from "../../pages";
import ResourceItemTitle from "../../../components/ResourceItemTitle";
import { defaultSeriesName } from "../../../seriesInfo/seriesConfig";
import { PossibleSeriesName } from "../../../seriesInfo/SeriesInfo.service";
import LinkWithoutStyles from "../../../components/LinkWithoutStyles";

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
      <LinkWithoutStyles to={link}>
        <ResourceItemTitle>
          {possibleName || defaultSeriesName}
        </ResourceItemTitle>
      </LinkWithoutStyles>
    </ResourceItem>
  );
}
