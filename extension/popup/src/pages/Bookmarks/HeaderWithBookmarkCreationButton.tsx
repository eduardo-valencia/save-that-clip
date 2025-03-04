import React from "react";
import BookmarkCreationButtonInfo from "./BookmarkCreationButtonInfo";
import { DialogToCreateOrEditBookmark } from "../../components/DialogToCreateOrEditBookmark";
import { DialogInfoProvider } from "../../components/DialogInfoProvider";
import Header, { HeaderProps } from "../../components/Header";
import CreationForm from "./BookmarkCreationDialog/CreationForm";

interface Props extends Pick<HeaderProps, "title"> {
  superTitle?: HeaderProps["before"];
}

export function HeaderWithBookmarkCreationButton({ title, superTitle }: Props) {
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
