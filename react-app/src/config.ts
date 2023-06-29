const { REACT_APP_API_URL, NODE_ENV } = process.env;

const handleInvalidApiUrl = (): never => {
  throw new Error("The API's URL is not a string.");
};

const getAndValidateApiUrl = (): string => {
  if (NODE_ENV === "test") return "http://localhost:5000";
  if (typeof REACT_APP_API_URL !== "string") return handleInvalidApiUrl();
  return REACT_APP_API_URL;
};

export interface Config {
  apiUrl: string;
}

const config: Config = {
  apiUrl: getAndValidateApiUrl(),
};

export default config;
