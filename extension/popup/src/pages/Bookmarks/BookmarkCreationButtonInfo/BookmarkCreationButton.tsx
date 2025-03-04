import { Button } from "@mui/material";
import {
  DialogInfo,
  useDialogContext,
} from "../../../components/DialogInfoProvider";
import { IsButtonDisabled } from ".";

interface Props {
  disabled: IsButtonDisabled;
}

export default function BookmarkCreationButton({
  disabled,
}: Props): JSX.Element {
  const { open }: DialogInfo = useDialogContext();

  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        px: "0.75rem",
        py: "0.75rem",
        boxShadow: 0,
      }}
      onClick={open}
      disabled={disabled}
    >
      Add Bookmark
    </Button>
  );
}
