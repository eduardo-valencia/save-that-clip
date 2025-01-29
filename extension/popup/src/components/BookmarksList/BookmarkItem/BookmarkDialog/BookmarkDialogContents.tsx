import React from "react";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";

type Props = {
  bookmark: Bookmark;
};

export const BookmarkDialogContents = ({ bookmark }: Props) => {
  const { name } = bookmark;
  return (
    <div>
      <p>{name}</p>
    </div>
  );
};
