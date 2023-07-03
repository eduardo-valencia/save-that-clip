import { useContext } from "react";
import { Layout } from "../../components/Layout";
import {
  SearchContext,
  SearchContextValue,
} from "../../components/SearchProvider";
import SeriesSection from "./SeriesSection";
import BookmarkSearchResults from "../../components/BookmarkSearchResults";
import HeaderWithBookmarkCreationButton from "../../components/HeaderWithBookmarkCreationButton";

const BookmarksPage = () => {
  const { query }: SearchContextValue = useContext(SearchContext);

  return (
    <Layout>
      <HeaderWithBookmarkCreationButton title="Bookmarks" />
      {query ? <BookmarkSearchResults /> : <SeriesSection />}
    </Layout>
  );
};

export default BookmarksPage;
