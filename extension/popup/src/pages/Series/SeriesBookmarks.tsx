import { useContext } from "react";
import _ from "lodash";
import { Bookmark } from "../../bookmarks/Bookmarks.repo-abstraction";
import BookmarksListWithLoader, {
  BookmarksListWithLoaderProps,
} from "../../components/BookmarksList/BookmarksListWithLoader";
import {
  BookmarksContextValue,
  BookmarksContext,
} from "../../components/BookmarksProvider";
import { PossibleSeriesName } from "../../seriesInfo/SeriesInfo.service";

interface Props {
  possibleSeriesName: PossibleSeriesName;
}

export default function SeriesBookmarks({ possibleSeriesName }: Props) {
  const { bookmarks }: BookmarksContextValue = useContext(BookmarksContext);

  const filterBookmarksBySeries = (): Bookmark[] => {
    return _.filter(bookmarks, { seriesName: possibleSeriesName });
  };

  const getBookmarks =
    (): BookmarksListWithLoaderProps["possibleBookmarks"] => {
      if (!bookmarks) return null;
      return filterBookmarksBySeries();
    };

  return <BookmarksListWithLoader possibleBookmarks={getBookmarks()} />;
}
