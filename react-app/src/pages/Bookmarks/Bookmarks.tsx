import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import BookmarkCreationButton from "./BookmarkCreationButton";

const Bookmarks = () => {
  return (
    <Layout>
      <Header title="Bookmarks" sx={{ marginBottom: "2.5rem" }}>
        <BookmarkCreationButton />
      </Header>
    </Layout>
  );
};

export default Bookmarks;
