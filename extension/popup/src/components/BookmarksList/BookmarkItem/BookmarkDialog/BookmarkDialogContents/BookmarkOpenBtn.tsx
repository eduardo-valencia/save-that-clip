import { Button } from "@mui/material";
import React, { useCallback } from "react";
import { Bookmark } from "../../../../../bookmarks/Bookmarks.repo-abstraction";
import { DialogInfo, useDialogContext } from "../../../../DialogInfoProvider";
import { bookmarksService } from "../../../../../bookmarks/bookmarksService";
import { Tab } from "../../../../../tabs/Tabs.repo-abstraction";
import { OpenInNew } from "@mui/icons-material";

type Props = { bookmark: Bookmark };

export const BookmarkOpenBtn = ({ bookmark }: Props) => {
  const { close }: DialogInfo = useDialogContext();

  const handleClick = useCallback((): void => {
    const run = async (): Promise<void> => {
      const tab: Tab = await bookmarksService.openBookmarkTabAtTime(bookmark);
      await bookmarksService.closeExtraEpisodeTabs(tab);
      close();
    };

    void run();
  }, [bookmark, close]);

  return (
    <>
      {/* Note that we need this link so the user can open the tab even if
      the functionality to set the video's time is broken */}
      <Button variant="contained" onClick={handleClick} endIcon={<OpenInNew />}>
        Open
      </Button>
    </>
  );
};
