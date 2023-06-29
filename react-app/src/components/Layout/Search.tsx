import { ChangeEvent, useContext } from "react";
import { FormControl, Input, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { SearchContext, SearchContextValue } from "../SearchProvider";

export const Search = (): JSX.Element => {
  const { query, setQuery }: SearchContextValue = useContext(SearchContext);

  const handleMissingSetQuery = (): never => {
    throw new Error(
      "Failed to set the search query because setQuery is missing."
    );
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!setQuery) return handleMissingSetQuery();
    setQuery(event.target.value);
  };

  return (
    <FormControl variant="standard">
      <Input
        id="search"
        value={query}
        onChange={handleChange}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};
