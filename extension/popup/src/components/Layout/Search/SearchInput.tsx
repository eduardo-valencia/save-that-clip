import { ChangeEvent, useContext } from "react";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { SearchContext, SearchContextValue } from "../../SearchProvider";

export const SearchInput = (): JSX.Element => {
  const { query, setQuery }: SearchContextValue = useContext(SearchContext);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setQuery!(event.target.value);
  };

  return (
    <TextField
      label="Search Bookmarks"
      placeholder="Search"
      id="search"
      value={query}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      variant="outlined"
      sx={{ mr: "1rem" }}
    />
  );
};
