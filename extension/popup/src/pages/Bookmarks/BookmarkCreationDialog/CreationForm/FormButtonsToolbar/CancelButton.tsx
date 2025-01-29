import {
  DialogInfo,
  useDialogContext,
} from "../../../../../components/DialogInfoProvider";
import FormActionButton from "../FormActionButton";

export default function CancelButton() {
  const { close }: DialogInfo = useDialogContext();
  return (
    <FormActionButton
      variant="outlined"
      color="error"
      type="button"
      onClick={close}
    >
      Cancel
    </FormActionButton>
  );
}
