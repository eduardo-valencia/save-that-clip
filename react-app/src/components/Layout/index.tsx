import { AppBar, BoxProps, Toolbar } from "@mui/material";

export function PageContainer({ sx, ...other }: BoxProps): JSX.Element {
  return (
    <div>
      <AppBar>
        <Toolbar></Toolbar>
      </AppBar>
    </div>
  );
}
