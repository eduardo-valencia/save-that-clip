import React from "react";
import BookmarkCreationButtonInfo from "../pages/Bookmarks/BookmarkCreationButtonInfo";
import { DialogToCreateOrEditBookmark } from "./DialogToCreateOrEditBookmark";
import { DialogInfoProvider } from "./DialogInfoProvider";
import Header, { HeaderProps } from "./Header";
import CreationForm from "../pages/Bookmarks/BookmarkCreationDialog/CreationForm";

type Props = Pick<HeaderProps, "title">;

export default function HeaderWithBookmarkCreationButton({ title }: Props) {
  return (
    <DialogInfoProvider>
      <Header title={title} sx={{ marginBottom: "2.5rem" }}>
        <BookmarkCreationButtonInfo />
      </Header>
      <DialogToCreateOrEditBookmark title="Add Bookmark">
        <CreationForm />
      </DialogToCreateOrEditBookmark>
    </DialogInfoProvider>
  );
}
