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
import { BookmarkDialogAndProvider } from "../../components/BookmarkDialogAndProvider/BookmarkDialogAndProvider";
import { Typography } from "@mui/material";

const BookmarksPage = () => {
  const { query }: SearchContextValue = useContext(SearchContext);
  const { bookmarks }: BookmarksContextValue = useContext(BookmarksContext);

  return (
    <Layout>
      <BookmarkDialogAndProvider>
        <HeaderWithBookmarkCreationButton
          title="Bookmarks"
          subtitle={
            // TODO: Dont' use btn variant
            <Typography variant="button" sx={{ marginTop: "0.25rem" }}>
              Your bookmarks, by series.
            </Typography>
          }
        />
        {query ? (
          <BookmarkSearchResults possibleBookmarks={bookmarks} />
        ) : (
          <SeriesSection />
        )}
      </BookmarkDialogAndProvider>
    </Layout>
  );
};

export default BookmarksPage;
