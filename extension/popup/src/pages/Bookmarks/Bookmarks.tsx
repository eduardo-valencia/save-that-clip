import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import BookmarkCreationButton from "./BookmarkCreationButton";
import { BookmarkCreationDialog } from "./BookmarkCreationDialog";
import { BookmarkCreationDialogProvider } from "./BookmarkCreationDialog/BookmarkCreationDialogProvider";

const Bookmarks = () => {
  return (
    <Layout>
      <BookmarkCreationDialogProvider>
        <Header title="Bookmarks" sx={{ marginBottom: "2.5rem" }}>
          <BookmarkCreationButton />
        </Header>
        <BookmarkCreationDialog />
      </BookmarkCreationDialogProvider>
    </Layout>
  );
};

export default Bookmarks;
