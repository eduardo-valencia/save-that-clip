# Extension

## Structure

### Main

All parts of the extension except for the popup.

### Popup

The popup is the part of the extension that users see and interact with. Users can open the popup by clicking on the extension's icon in the Chrome toolbar.

## Commands

### Popup's commands

#### `npm run popup-build`

Adds the extension into the extension's build folder so that we can load it into Chrome. Please note that the extension's build folder differs from the React App's build folder.

#### `npm run popup-test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run popup-test:watch`

Runs the tests in watch mode.

#### `npm run popup-lint-ts`

Lints TypeScript files.

### Main's commands

#### `npm run main-test`

Runs the tests.

#### `npm run main-test:watch`

Runs the tests in watch mode.

#### `npm run main-lint-ts`

Lints TypeScript files.

### `npx gulp dev`

**Note**: This requires <https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid>.

Watches the application for changes. When it detects changes to the React App's code, it builds the extension automatically and reloads the extension.
