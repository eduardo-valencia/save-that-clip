const { API_URL } = process.env;

const handleInvalidApiUrl = (): never => {
  throw new Error("The API's URL is not a string.");
};

const getAndValidateApiUrl = (): string => {
  if (typeof API_URL !== "string") return handleInvalidApiUrl();
  return API_URL;
};

interface Config {
  apiUrl: string;
}

const config: Config = {
  apiUrl: getAndValidateApiUrl(),
};

export default config;
