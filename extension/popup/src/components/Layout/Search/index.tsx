import { Box } from "@mui/material";
import React, { useContext } from "react";
import { SearchInput } from "./SearchInput";
import ClearQueryButton from "./ClearQueryButton";
import { SearchContextValue, SearchContext } from "../../SearchProvider";

export default function Search() {
  const { query }: SearchContextValue = useContext(SearchContext);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <SearchInput />
      {query ? <ClearQueryButton /> : null}
    </Box>
  );
}
