import React from "react";
import { TextField } from "@mui/material";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";

type Name = Bookmark["name"];

interface Props {
  setName: React.Dispatch<React.SetStateAction<Name>>;
  name: Name;
}

export default function BookmarkNameField({
  setName,
  name,
}: Props): JSX.Element {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  return (
    <TextField
      label="Name"
      variant="outlined"
      placeholder="A cool moment"
      onChange={handleChange}
      value={name}
      InputLabelProps={{ shrink: true }}
      fullWidth
      required
    ></TextField>
  );
}
