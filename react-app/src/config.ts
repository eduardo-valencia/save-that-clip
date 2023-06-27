const { API_URL, NODE_ENV } = process.env;

const handleInvalidApiUrl = (): never => {
  throw new Error("The API's URL is not a string.");
};

const getAndValidateApiUrl = (): string => {
  if (NODE_ENV === "test") return "http://localhost:5000";
  if (typeof API_URL !== "string") return handleInvalidApiUrl();
  return API_URL;
};

export interface Config {
  apiUrl: string;
}

const config: Config = {
  apiUrl: getAndValidateApiUrl(),
};

export default config;
