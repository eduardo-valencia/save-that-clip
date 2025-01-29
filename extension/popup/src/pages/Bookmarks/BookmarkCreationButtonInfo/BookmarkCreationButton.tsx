import { Button } from "@mui/material";
import {
  DialogInfo,
  useDialogInfo,
} from "../../../components/DialogInfoProvider";
import { IsButtonDisabled } from ".";

interface Props {
  disabled: IsButtonDisabled;
}

export default function BookmarkCreationButton({
  disabled,
}: Props): JSX.Element {
  const { open }: DialogInfo = useDialogInfo();

  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        width: "9.0625rem",
        px: "0.56rem",
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
