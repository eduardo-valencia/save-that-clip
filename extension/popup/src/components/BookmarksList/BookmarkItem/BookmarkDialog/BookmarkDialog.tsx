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
} from "../../../BookmarkDialogAndProvider";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";
import _, { ListIterateeCustom } from "lodash";
import {
  BookmarksContextValue,
  useBookmarksContext,
} from "../../../BookmarksProvider";

export const BookmarkDialog = () => {
  const { setIdOfBookmarkToView, idOfBookmarkToView }: BookmarkDialogInfo =
    useBookmarkDialogInfo();
  const { bookmarks }: BookmarksContextValue = useBookmarksContext();

  const setIsOpen = useCallback(
    (newIsOpen: boolean) => {
      if (newIsOpen) throw new Error("Open functionality not implemented");
      setIdOfBookmarkToView(null);
    },
    [setIdOfBookmarkToView]
  );

  type PossibleBookmark = Bookmark | undefined;

  const possibleBookmark = useMemo((): PossibleBookmark => {
    if (!idOfBookmarkToView) return;
    const predicate: ListIterateeCustom<Bookmark, boolean> = {
      id: idOfBookmarkToView,
    };
    return _.find<Bookmark>(bookmarks, predicate);
  }, [bookmarks, idOfBookmarkToView]);

  const dialogInfo: DialogInfo = useDialogInfo({
    isOpen: Boolean(possibleBookmark),
    setIsOpen,
  });

  const renderContents = (bookmark: Bookmark): JSX.Element => {
    return (
      <Dialog open={dialogInfo.isOpen} onClose={dialogInfo.close} fullScreen>
        <DialogToolbar endBtn={<EditingBtnAndDialog bookmark={bookmark} />} />
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
