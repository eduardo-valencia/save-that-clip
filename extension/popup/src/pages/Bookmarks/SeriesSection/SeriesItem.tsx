import React from "react";
import ResourceItem from "../../../components/ResourceItem";
import { Link } from "react-router-dom";
import { Pages } from "../../pages";
import ResourceItemTitle from "../../../components/ResourceItemTitle";
import { defaultSeriesName } from "../../../seriesInfo/seriesConfig";
import { PossibleSeriesName } from "../../../seriesInfo/SeriesInfo.service";

interface Props {
  possibleName: PossibleSeriesName;
}

export default function SeriesItem({ possibleName }: Props) {
  const getLink = (): string => {
    const pageId: string = possibleName ? possibleName : "null";
    return `${Pages.series}/${pageId}`;
  };

  const link: string = getLink();
  return (
    <ResourceItem>
      <Link to={link}>
        <ResourceItemTitle>
          {possibleName || defaultSeriesName}
        </ResourceItemTitle>
      </Link>
    </ResourceItem>
  );
}
