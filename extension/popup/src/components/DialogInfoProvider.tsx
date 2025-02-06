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
  setIsOpen: (newIsOpen: IsOpen) => void;
  close: CloseOrOpen;
  open: CloseOrOpen;
}

type EssentialDialogControls = Pick<DialogInfo, "setIsOpen" | "isOpen">;

export const useDialogInfo = (): EssentialDialogControls => {
  const [isOpen, setIsOpen] = useState<IsOpen>(false);

  const dialogInfo = useMemo((): EssentialDialogControls => {
    return { isOpen, setIsOpen };
  }, [isOpen]);

  return dialogInfo;
};

type PossibleDialogInfo = DialogInfo | null;
export const DialogContext = createContext<PossibleDialogInfo>(null);

export const useDialogContext = (): DialogInfo => {
  const value: PossibleDialogInfo = useContext(DialogContext);
  if (value) return value;
  throw new Error("Dialog context is missing");
};

interface Props extends Partial<EssentialDialogControls> {
  children: React.ReactNode;
}

export const DialogInfoProvider = ({
  children,
  isOpen: customIsOpen,
  setIsOpen: customSetIsOpen,
}: Props): JSX.Element => {
  const dialogInfo: EssentialDialogControls = useDialogInfo();

  const setIsOpen: DialogInfo["setIsOpen"] =
    customSetIsOpen ?? dialogInfo.setIsOpen;

  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const value = useMemo((): DialogInfo => {
    return {
      isOpen: customIsOpen ?? dialogInfo.isOpen,
      setIsOpen,
      close,
      open,
    };
  }, [close, customIsOpen, dialogInfo.isOpen, open, setIsOpen]);

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
};
