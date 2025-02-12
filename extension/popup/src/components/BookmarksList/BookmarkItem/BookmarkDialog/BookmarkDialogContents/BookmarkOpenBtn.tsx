import { Button } from "@mui/material";
import React from "react";
import { Bookmark } from "../../../../../bookmarks/Bookmarks.repo-abstraction";
import { DialogInfo, useDialogContext } from "../../../../DialogInfoProvider";
import { bookmarksService } from "../../../../../bookmarks/bookmarksService";

type Props = { bookmark: Bookmark };

export const BookmarkOpenBtn = ({ bookmark }: Props) => {
  const { close }: DialogInfo = useDialogContext();

  return (
    <>
      {/* Note that we need this link just in case the func that open the bookmark
          while on the episode's tab breaks. */}
      <Button
        variant="contained"
        onClick={close}
        href={bookmarksService.getUrlWithTime(bookmark)}
        target="_blank"
      >
        Open
      </Button>
    </>
  );
};
