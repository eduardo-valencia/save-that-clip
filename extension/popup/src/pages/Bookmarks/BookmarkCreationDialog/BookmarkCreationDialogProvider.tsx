import React, {
  useState,
  SetStateAction,
  Dispatch,
  createContext,
} from "react";

type IsOpen = boolean;
type CloseOrOpen = () => void;

export interface BookmarkCreationDialogContextValue {
  isOpen: IsOpen;
  setIsOpen?: Dispatch<SetStateAction<IsOpen>>;
  close?: CloseOrOpen;
  open?: CloseOrOpen;
}

const defaultIsOpen = false;

export const BookmarkCreationDialogContext =
  createContext<BookmarkCreationDialogContextValue>({
    isOpen: defaultIsOpen,
  });

interface Props {
  children: React.ReactNode;
}

export const BookmarkCreationDialogProvider = ({
  children,
}: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState<IsOpen>(defaultIsOpen);

  const close: CloseOrOpen = () => {
    setIsOpen(false);
  };

  const open: CloseOrOpen = () => {
    setIsOpen(true);
  };

  return (
    <BookmarkCreationDialogContext.Provider
      value={{ isOpen, setIsOpen, close, open }}
    >
      {children}
    </BookmarkCreationDialogContext.Provider>
  );
};
