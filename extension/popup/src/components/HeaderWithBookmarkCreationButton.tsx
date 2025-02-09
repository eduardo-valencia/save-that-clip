import React from "react";
import BookmarkCreationButtonInfo from "../pages/Bookmarks/BookmarkCreationButtonInfo";
import { BookmarkCreationDialog } from "../pages/Bookmarks/BookmarkCreationDialog";
import { BookmarkCreationDialogProvider } from "../pages/Bookmarks/BookmarkCreationDialog/BookmarkCreationDialogProvider";
import Header, { HeaderProps } from "./Header";

type Props = Pick<HeaderProps, "title">;

export default function HeaderWithBookmarkCreationButton({ title }: Props) {
  return (
    <BookmarkCreationDialogProvider>
      <Header title={title} sx={{ marginBottom: "2.5rem" }}>
        <BookmarkCreationButtonInfo />
      </Header>
      <BookmarkCreationDialog />
    </BookmarkCreationDialogProvider>
  );
}
