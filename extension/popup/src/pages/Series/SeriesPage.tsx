import { useContext } from "react";
import { Layout } from "../../components/Layout";
import {
  SearchContext,
  SearchContextValue,
} from "../../components/SearchProvider";
import HeaderWithBookmarkCreationButton from "../../components/HeaderWithBookmarkCreationButton";
import BookmarkSearchResults from "../../components/BookmarkSearchResults";
import { Params, useParams } from "react-router-dom";
import { PossibleSeriesName } from "../../seriesInfo/SeriesInfo.service";
import { defaultSeriesName } from "../../seriesInfo/seriesConfig";
import ToolbarWithBackButton from "./ToolbarWithBackButton";
import SeriesBookmarks from "./SeriesBookmarks";

const SeriesPage = () => {
  const { query }: SearchContextValue = useContext(SearchContext);
  const { name }: Readonly<Params<string>> = useParams();

  const decodeSeriesName = (): PossibleSeriesName => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return name === "null" ? null : name!;
  };

  const decodedName: PossibleSeriesName = decodeSeriesName();

  const getSeriesDisplayName = (): string => {
    return decodedName || defaultSeriesName;
  };

  const displayName: string = getSeriesDisplayName();

  return (
    <Layout>
      <ToolbarWithBackButton />
      <HeaderWithBookmarkCreationButton title={displayName} />
      {query ? (
        <BookmarkSearchResults />
      ) : (
        <SeriesBookmarks possibleSeriesName={decodedName} />
      )}
    </Layout>
  );
};

export default SeriesPage;
