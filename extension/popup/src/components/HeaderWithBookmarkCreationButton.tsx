import React from "react";
import BookmarkCreationButtonInfo from "../pages/Bookmarks/BookmarkCreationButtonInfo";
import { DialogToCreateOrEditBookmark } from "./DialogToCreateOrEditBookmark";
import { DialogInfoProvider } from "./DialogInfoProvider";
import Header, { HeaderProps } from "./Header";
import CreationForm from "../pages/Bookmarks/BookmarkCreationDialog/CreationForm";

interface Props extends Pick<HeaderProps, "title"> {
  superTitle?: HeaderProps["before"];
  subtitle?: React.ReactNode;
}

export default function HeaderWithBookmarkCreationButton({
  title,
  superTitle,
  subtitle,
}: Props) {
  return (
    <DialogInfoProvider>
      <Header before={superTitle} title={title}>
        {subtitle}
        <BookmarkCreationButtonInfo />
      </Header>
      <DialogToCreateOrEditBookmark title="Add Bookmark">
        <CreationForm />
      </DialogToCreateOrEditBookmark>
    </DialogInfoProvider>
  );
}
