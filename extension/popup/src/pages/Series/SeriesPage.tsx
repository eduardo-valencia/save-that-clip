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

const SeriesPage = () => {
  const { query }: SearchContextValue = useContext(SearchContext);
  const { name }: Readonly<Params<string>> = useParams();

  // todo: Throw an error if we cannot find a bookmark with this decoded name
  // because it might indicate an error with decoding, which might be likely if
  // this decoder doesn't work in certain edge cases.
  const decodeSeriesName = (): PossibleSeriesName => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return name === "null" ? null : name!;
  };

  const getSeriesDisplayName = (): string => {
    const decodedName: PossibleSeriesName = decodeSeriesName();
    return decodedName || defaultSeriesName;
  };

  const displayName: string = getSeriesDisplayName();

  return (
    <Layout>
      <ToolbarWithBackButton />
      <HeaderWithBookmarkCreationButton title={displayName} />
      {query ? <BookmarkSearchResults /> : null}
    </Layout>
  );
};

export default SeriesPage;
