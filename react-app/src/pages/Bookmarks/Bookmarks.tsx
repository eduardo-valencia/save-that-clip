import { useEffect } from "react";
import { Typography } from "@mui/material";
import PageContainer from "../../components/PageContainer";
import { BookmarksService } from "../../bookmarks/Bookmarks.service";

const bookmarksService = new BookmarksService();

const Bookmarks = () => {
  useEffect(() => {
    void bookmarksService.create({ name: "Test" });
  }, []);

  return (
    <PageContainer>
      <Typography variant="h1">Bookmarks</Typography>
    </PageContainer>
  );
};

export default Bookmarks;
