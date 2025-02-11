# Extension

## Structure

### Main

All parts of the extension except for the popup.

### Popup

The popup is the part of the extension that users see and interact with. Users can open the popup by clicking on the extension's icon in the Chrome toolbar.

## Environment Variables

You can provide the following environment variables in the app. They are optional unless otherwise specified:

- `NODE_ENV` (required)
- `SENTRY_ORG`: Sentry organization
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`

## Commands

### General commands

#### `npx gulp build`

Builds the popup and the "main" folder's files and copies them into the extension's build folder, `build`, so that we can load it into Chrome. This also generates the licensing info.

#### `npm run dev`

**Note**: This requires <https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid>.

Builds the application and watches the files for changes. When it detects changes to the React App's code, it builds the extension automatically and reloads the extension.

#### `npm run lint`

Lints all of the extension's files.

#### `npm run lint-ts`

Lints all of the extension's files with TypeScript.

#### `npm run test`

Runs all of the extension's tests.

### Popup's commands

#### `npm run popup-test`

Runs the tests.

#### `npm run popup-test:watch`

Runs the tests in watch mode.

#### `npm run popup-lint-ts`

Lints TypeScript files.

### Main folder's commands

#### `npm run main-test`

Runs the tests.

#### `npm run main-test:watch`

Runs the tests in watch mode.

#### `npm run main-lint-ts`

Lints TypeScript files.
