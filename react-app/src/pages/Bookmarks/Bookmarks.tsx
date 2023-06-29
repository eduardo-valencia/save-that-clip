import { useState } from "react";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import BookmarkCreationButton from "./BookmarkCreationButton";
import { BookmarkCreationDialog } from "./BookmarkCreationDialog";

type IsOpen = boolean;

export interface BookmarkCreationDialogInfo {
  setIsOpen: (isOpen: IsOpen) => void;
  isOpen: IsOpen;
}

const Bookmarks = () => {
  const [isOpen, setIsOpen] = useState<IsOpen>(false);

  return (
    <Layout>
      <Header title="Bookmarks" sx={{ marginBottom: "2.5rem" }}>
        <BookmarkCreationButton setIsOpen={setIsOpen} />
      </Header>
      <BookmarkCreationDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </Layout>
  );
};

export default Bookmarks;
