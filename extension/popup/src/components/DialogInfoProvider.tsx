import React, {
  useState,
  SetStateAction,
  Dispatch,
  createContext,
  useContext,
} from "react";

type IsOpen = boolean;
type CloseOrOpen = () => void;

export interface DialogInfo {
  isOpen: IsOpen;
  setIsOpen: Dispatch<SetStateAction<IsOpen>>;
  close: CloseOrOpen;
  open: CloseOrOpen;
}

export type PossibleDialogInfo = DialogInfo | null;

const defaultIsOpen = false;

export const DialogContext = createContext<PossibleDialogInfo>(null);

export const useDialogInfo = (): DialogInfo => {
  const value: PossibleDialogInfo = useContext(DialogContext);
  if (value) return value;
  throw new Error("Dialog context is missing");
};

interface Props {
  children: React.ReactNode;
}

export const DialogInfoProvider = ({ children }: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState<IsOpen>(defaultIsOpen);

  const close: CloseOrOpen = () => {
    setIsOpen(false);
  };

  const open: CloseOrOpen = () => {
    setIsOpen(true);
  };

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen, close, open }}>
      {children}
    </DialogContext.Provider>
  );
};
