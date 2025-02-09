import React, { useContext } from "react";
import ResourceList from "../../../components/ResourceList";
import {
  BookmarksContextValue,
  BookmarksContext,
} from "../../../components/BookmarksProvider";
import { PossibleSeriesName } from "../../../seriesInfo/SeriesInfo.service";
import _ from "lodash";
import SeriesItem from "./SeriesItem";

export default function SeriesList() {
  const { bookmarks }: BookmarksContextValue = useContext(BookmarksContext);

  const getSeriesList = (): PossibleSeriesName[] => {
    const possibleNames: PossibleSeriesName[] = _.map(bookmarks, "seriesName");
    /**
     * We do this to eliminate duplicates of null.
     */
    return _.uniq(possibleNames);
  };

  const renderSeriesItem = (
    seriesName: PossibleSeriesName,
    index: number
  ): JSX.Element => {
    return <SeriesItem possibleName={seriesName} key={index} />;
  };

  const renderSeriesItems = (): JSX.Element[] => {
    const seriesNames: PossibleSeriesName[] = getSeriesList();
    return seriesNames.map(renderSeriesItem);
  };

  const renderedItems: JSX.Element[] = renderSeriesItems();

  return <ResourceList>{renderedItems}</ResourceList>;
}
