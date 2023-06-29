import React, { useState } from "react";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";
import BookmarkNameField from "./BookmarkNameField";

export default function CreationForm() {
  const [name, setName] = useState<Bookmark["name"]>("");

  return (
    <form>
      <BookmarkNameField setName={setName} name={name} />
    </form>
  );
}
