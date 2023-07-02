# Extension

## Testing the Extension

See the React App's documentation for more information about testing it.

### Notes

- You might have to manually reload the extension (and not through <https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid>) if you made changes to the manifest.
- You may have to reload the page if Gulp reloads the extension automatically. Otherwise, the popup might be unable to connect to the content script, and you might receive a message saying, "Receiving end does not exist."

## Permissions

- We need the "tabs" permission to be able to see the URL.
