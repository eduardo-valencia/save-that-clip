import { Button, ButtonProps } from "@mui/material";

export const BtnToViewBookmark = (props: ButtonProps) => {
  return (
    <Button
      {...props}
      size="small"
      variant="contained"
      sx={{ padding: 1, ml: "auto" }}
    >
      View
    </Button>
  );
};
