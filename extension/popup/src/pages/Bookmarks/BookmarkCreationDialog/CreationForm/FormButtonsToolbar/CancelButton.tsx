import {
  DialogInfo,
  useDialogInfo,
} from "../../../../../components/DialogInfoProvider";
import FormActionButton from "../FormActionButton";

export default function CancelButton() {
  const { close }: DialogInfo = useDialogInfo();
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
