import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import BookmarkCreationButton from "./BookmarkCreationButton";

const Bookmarks = () => {
  return (
    <Layout>
      <Header title="Bookmarks">
        <BookmarkCreationButton />
      </Header>
    </Layout>
  );
};

export default Bookmarks;
