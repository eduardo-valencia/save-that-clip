export interface Config {
  apiUrl: string;
}

const config: Config = {
  /**
   * ! This shouldn't have a trailing slash because it could break the app.
   */
  apiUrl: "http://localhost:5000",
};

export default config;
