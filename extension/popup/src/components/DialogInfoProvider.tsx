import React, { useState, createContext, useCallback, useMemo } from "react";
import { createContextGetterHook } from "../utils/client.utils";

type IsOpen = boolean;
type CloseOrOpen = () => void;
export interface DialogInfo {
  isOpen: IsOpen;
  setIsOpen: (newIsOpen: IsOpen) => void;
  close: CloseOrOpen;
  open: CloseOrOpen;
}
export type EssentialDialogControls = Pick<DialogInfo, "setIsOpen" | "isOpen">;
type PossibleDialogControls = Partial<EssentialDialogControls>;

export const useDialogInfo = ({
  isOpen: customIsOpen,
  setIsOpen: customSetIsOpen,
}: PossibleDialogControls = {}): DialogInfo => {
  const [isOpenFromDefaultHook, setIsOpenFromDefaultHook] =
    useState<IsOpen>(false);

  const setIsOpen: DialogInfo["setIsOpen"] =
    customSetIsOpen ?? setIsOpenFromDefaultHook;

  const close: CloseOrOpen = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const open: CloseOrOpen = useCallback(() => {
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

export const useDialogContext = createContextGetterHook(
  DialogContext,
  "Dialog context"
);

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
