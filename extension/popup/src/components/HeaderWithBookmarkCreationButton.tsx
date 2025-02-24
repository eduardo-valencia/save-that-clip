import React from "react";
import BookmarkCreationButtonInfo from "../pages/Bookmarks/BookmarkCreationButtonInfo";
import { DialogToCreateOrEditBookmark } from "./DialogToCreateOrEditBookmark";
import { DialogInfoProvider } from "./DialogInfoProvider";
import Header, { HeaderProps } from "./Header";
import CreationForm from "../pages/Bookmarks/BookmarkCreationDialog/CreationForm";

interface Props extends Pick<HeaderProps, "title"> {
  superTitle?: HeaderProps["before"];
}

export default function HeaderWithBookmarkCreationButton({
  title,
  superTitle,
}: Props) {
  return (
    <DialogInfoProvider>
      <Header before={superTitle} title={title}>
        <BookmarkCreationButtonInfo />
      </Header>
      <DialogToCreateOrEditBookmark title="Add Bookmark">
        <CreationForm />
      </DialogToCreateOrEditBookmark>
    </DialogInfoProvider>
  );
}
