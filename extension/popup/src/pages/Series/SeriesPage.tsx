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
import _ from "lodash";
import { Bookmark } from "../../bookmarks/Bookmarks.repo-abstraction";
import BookmarksListWithLoader from "../../components/BookmarksList/BookmarksListWithLoader";
import {
  BookmarksContextValue,
  BookmarksContext,
} from "../../components/BookmarksProvider";
import { BookmarkDialogAndProvider } from "../../components/BookmarkDialogAndProvider/BookmarkDialogAndProvider";
import { SeriesSubtitle } from "./SeriesSubtitle";

type PossibleBookmarks = BookmarksContextValue["bookmarks"];

const SeriesPage = () => {
  const { query }: SearchContextValue = useContext(SearchContext);
  const { name }: Readonly<Params<string>> = useParams();
  const { bookmarks }: BookmarksContextValue = useContext(BookmarksContext);

  const decodeSeriesName = (): PossibleSeriesName => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return name === "null" ? null : name!;
  };

  const decodedName: PossibleSeriesName = decodeSeriesName();

  const getSeriesDisplayName = (): string => {
    return decodedName || defaultSeriesName;
  };

  const filterBookmarksBySeries = (): Bookmark[] => {
    return _.filter(bookmarks, { seriesName: decodedName });
  };

  const getSeriesBookmarks = (): PossibleBookmarks => {
    if (!bookmarks) return null;
    return filterBookmarksBySeries();
  };

  const displayName: string = getSeriesDisplayName();
  const possibleBookmarks: PossibleBookmarks = getSeriesBookmarks();

  return (
    <Layout>
      <BookmarkDialogAndProvider>
        <ToolbarWithBackButton />
        <HeaderWithBookmarkCreationButton
          title={displayName}
          superTitle={<SeriesSubtitle />}
        />
        {query ? (
          <BookmarkSearchResults
            possibleBookmarks={possibleBookmarks}
            showEpisode
          />
        ) : (
          <BookmarksListWithLoader
            possibleBookmarks={possibleBookmarks}
            showEpisode
          />
        )}
      </BookmarkDialogAndProvider>
    </Layout>
  );
};

export default SeriesPage;
