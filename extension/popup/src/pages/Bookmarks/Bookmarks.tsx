import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import { BookmarkCreationDialog } from "./BookmarkCreationDialog";
import { BookmarkCreationDialogProvider } from "./BookmarkCreationDialog/BookmarkCreationDialogProvider";
import BookmarkCreationButtonInfo from "./BookmarkCreationButtonInfo";

const Bookmarks = () => {
  return (
    <Layout>
      <BookmarkCreationDialogProvider>
        <Header title="Bookmarks" sx={{ marginBottom: "2.5rem" }}>
          <BookmarkCreationButtonInfo />
        </Header>
        <BookmarkCreationDialog />
      </BookmarkCreationDialogProvider>
    </Layout>
  );
};

export default Bookmarks;
