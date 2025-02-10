import { Dialog, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import {
  DialogInfo,
  DialogInfoProvider,
  useDialogInfo,
} from "../../../DialogInfoProvider";
import { DialogToolbar } from "../../../DialogToolbar";
import PageContainer from "../../../PageContainer";
import { BookmarkDialogContents } from "./BookmarkDialogContents/BookmarkDialogContents";
import { EditingBtnAndDialog } from "./EditingBtnAndDialog";
import {
  BookmarkDialogInfo,
  useBookmarkDialogInfo,
} from "../../../BookmarkDialogAndProvider/BookmarkDialogAndProvider";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";
import _ from "lodash";
import {
  BookmarksContextValue,
  useBookmarksContext,
} from "../../../BookmarksProvider";

export const BookmarkDialog = () => {
  const { setIdOfBookmarkToView, idOfBookmarkToView }: BookmarkDialogInfo =
    useBookmarkDialogInfo();
  const { bookmarks }: BookmarksContextValue = useBookmarksContext();

  const setIsOpen = useCallback(
    (shouldOpen: boolean) => {
      if (shouldOpen) throw new Error("Open functionality not implemented");
      setIdOfBookmarkToView(null);
    },
    [setIdOfBookmarkToView]
  );

  type PossibleBookmark = Bookmark | undefined;

  const possibleBookmark = useMemo((): PossibleBookmark => {
    if (!idOfBookmarkToView) return;
    return _.find<Bookmark>(bookmarks, { id: idOfBookmarkToView });
  }, [bookmarks, idOfBookmarkToView]);

  const dialogInfo: DialogInfo = useDialogInfo({
    /**
     * We don't open this when we couldn't find the bookmark because it could
     * mean it was deleted.
     */
    isOpen: Boolean(possibleBookmark),
    setIsOpen,
  });

  const renderContents = (bookmark: Bookmark): JSX.Element => {
    return (
      <Dialog open={dialogInfo.isOpen} onClose={dialogInfo.close} fullScreen>
        <DialogToolbar extraBtn={<EditingBtnAndDialog bookmark={bookmark} />} />
        <PageContainer>
          <Typography variant="h1" sx={{ marginBottom: "2.13rem" }}>
            Bookmark Info
          </Typography>
          <BookmarkDialogContents bookmark={bookmark} />
        </PageContainer>
      </Dialog>
    );
  };

  if (!possibleBookmark) return null;
  return (
    <DialogInfoProvider {...dialogInfo}>
      {renderContents(possibleBookmark)}
    </DialogInfoProvider>
  );
};
