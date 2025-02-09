import { Typography } from "@mui/material";
import { Layout } from "../components/Layout";

const ErrorPage = () => {
  return (
    <Layout>
      <Typography variant="h1">There was an unexpected error.</Typography>
      <Typography>Please try again later.</Typography>
    </Layout>
  );
};

export default ErrorPage;
