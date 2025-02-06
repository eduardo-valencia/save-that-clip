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
type PossibleDialogControls = Partial<EssentialDialogControls>;
export const useDialogInfo = ({
  isOpen: customIsOpen,
  setIsOpen: customSetIsOpen,
}: PossibleDialogControls = {}): DialogInfo => {
  const [isOpenFromDefaultHook, setIsOpenFromDefaultHook] =
    useState<IsOpen>(false);

  const setIsOpen: DialogInfo["setIsOpen"] =
    customSetIsOpen ?? setIsOpenFromDefaultHook;

  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const value = useMemo((): DialogInfo => {
    return {
      isOpen: customIsOpen ?? isOpenFromDefaultHook,
      setIsOpen,
      close,
      open,
    };
  }, [close, customIsOpen, isOpenFromDefaultHook, open, setIsOpen]);

  return value;
};

type PossibleDialogInfo = DialogInfo | null;
export const DialogContext = createContext<PossibleDialogInfo>(null);

export const useDialogContext = (): DialogInfo => {
  const value: PossibleDialogInfo = useContext(DialogContext);
  if (value) return value;
  throw new Error("Dialog context is missing");
};

interface Props extends PossibleDialogControls {
  children: React.ReactNode;
}

export const DialogInfoProvider = ({
  children,
  ...fields
}: Props): JSX.Element => {
  const dialogInfo: DialogInfo = useDialogInfo(fields);

  return (
    <DialogContext.Provider value={dialogInfo}>
      {children}
    </DialogContext.Provider>
  );
};
