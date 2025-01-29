import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useContext } from "react";
import { SearchContextValue, SearchContext } from "../../SearchProvider";

export default function ClearQueryButton() {
  const { setQuery }: SearchContextValue = useContext(SearchContext);

  const clearQuery = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setQuery!("");
  };

  return (
    <IconButton onClick={clearQuery}>
      <CloseIcon />
    </IconButton>
  );
}
