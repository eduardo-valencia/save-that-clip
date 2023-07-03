import { useContext } from "react";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import { BookmarkCreationDialog } from "./BookmarkCreationDialog";
import { BookmarkCreationDialogProvider } from "./BookmarkCreationDialog/BookmarkCreationDialogProvider";
import BookmarkCreationButtonInfo from "./BookmarkCreationButtonInfo";
import {
  SearchContext,
  SearchContextValue,
} from "../../components/SearchProvider";
import SeriesSection from "./SeriesSection";
import BookmarkSearchResults from "./BookmarkSearchResults";

const Bookmarks = () => {
  const { query }: SearchContextValue = useContext(SearchContext);

  return (
    <Layout>
      <BookmarkCreationDialogProvider>
        <Header title="Bookmarks" sx={{ marginBottom: "2.5rem" }}>
          <BookmarkCreationButtonInfo />
        </Header>
        <BookmarkCreationDialog />
      </BookmarkCreationDialogProvider>
      {query ? <BookmarkSearchResults /> : <SeriesSection />}
    </Layout>
  );
};

export default Bookmarks;
