import { Button } from "@mui/material";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";
import { useBookmarkDialogInfo } from "../../../../components/BookmarkDialogAndProvider/BookmarkDialogAndProvider";
import { toast } from "sonner";
import { useCallback } from "react";

interface Props {
  bookmarkId: Bookmark["id"];
  toastId: string;
}

export const BtnToViewBookmark = ({ bookmarkId, toastId }: Props) => {
  const { setIdOfBookmarkToView } = useBookmarkDialogInfo();

  const handleClick = useCallback((): void => {
    setIdOfBookmarkToView(bookmarkId);
    toast.dismiss(toastId);
  }, [bookmarkId, setIdOfBookmarkToView, toastId]);

  return (
    <Button
      size="small"
      variant="contained"
      sx={{ padding: 1, ml: "auto" }}
      color="success"
      onClick={handleClick}
    >
      View
    </Button>
  );
};
