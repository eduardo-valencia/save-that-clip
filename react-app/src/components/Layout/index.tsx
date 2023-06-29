import { AppBar, BoxProps, Toolbar } from "@mui/material";
import { Search } from "./Search";
import PageContainer from "../PageContainer";

export function Layout({ sx, ...other }: BoxProps): JSX.Element {
  return (
    <PageContainer>
      <AppBar>
        <Toolbar>
          <Search />
        </Toolbar>
      </AppBar>
    </PageContainer>
  );
}
