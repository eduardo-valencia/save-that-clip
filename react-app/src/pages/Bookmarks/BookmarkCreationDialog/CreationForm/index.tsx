import React, { useContext, useState } from "react";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";
import BookmarkNameField from "./BookmarkNameField";
import { Box } from "@mui/material";
import CancelButton from "./CancelButton";
import SaveButton from "./SaveButton";
import {
  BookmarkCreationDialogContextValue,
  BookmarkCreationDialogContext,
} from "../BookmarkCreationDialogProvider";

export default function CreationForm() {
  const [name, setName] = useState<Bookmark["name"]>("");

  const { close }: BookmarkCreationDialogContextValue = useContext(
    BookmarkCreationDialogContext
  );

  const handleSubmission = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    close!();
  };

  return (
    <form onSubmit={handleSubmission}>
      <Box sx={{ marginBottom: "4.13rem" }}>
        <BookmarkNameField setName={setName} name={name} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <CancelButton />
        <SaveButton />
      </Box>
    </form>
  );
}
