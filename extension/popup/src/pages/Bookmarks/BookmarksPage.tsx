import { useContext } from "react";
import { Layout } from "../../components/Layout";
import {
  SearchContext,
  SearchContextValue,
} from "../../components/SearchProvider";
import SeriesSection from "./SeriesSection";
import BookmarkSearchResults from "../../components/BookmarkSearchResults";
import HeaderWithBookmarkCreationButton from "../../components/HeaderWithBookmarkCreationButton";
import {
  BookmarksContext,
  BookmarksContextValue,
} from "../../components/BookmarksProvider";

const BookmarksPage = () => {
  const { query }: SearchContextValue = useContext(SearchContext);
  const { bookmarks }: BookmarksContextValue = useContext(BookmarksContext);

  return (
    <Layout>
      <HeaderWithBookmarkCreationButton title="Bookmarks" />
      {query ? (
        <BookmarkSearchResults possibleBookmarks={bookmarks} />
      ) : (
        <SeriesSection />
      )}
    </Layout>
  );
};

export default BookmarksPage;
