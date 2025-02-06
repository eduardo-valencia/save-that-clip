import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";

type IsOpen = boolean;
type CloseOrOpen = () => void;

export interface DialogInfo {
  isOpen: IsOpen;
  close: CloseOrOpen;
  open: CloseOrOpen;
}

export const useDialogInfo = (): DialogInfo => {
  const [isOpen, setIsOpen] = useState<IsOpen>(false);

  const close: CloseOrOpen = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open: CloseOrOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const dialogInfo = useMemo((): DialogInfo => {
    return { close, open, isOpen };
  }, [close, isOpen, open]);

  return dialogInfo;
};

type PossibleDialogInfo = DialogInfo | null;
export const DialogContext = createContext<PossibleDialogInfo>(null);

export const useDialogContext = (): DialogInfo => {
  const value: PossibleDialogInfo = useContext(DialogContext);
  if (value) return value;
  throw new Error("Dialog context is missing");
};

interface Props {
  children: React.ReactNode;
}

export const DialogInfoProvider = ({ children }: Props): JSX.Element => {
  const dialogInfo: DialogInfo = useDialogInfo();

  return (
    <DialogContext.Provider value={dialogInfo}>
      {children}
    </DialogContext.Provider>
  );
};
