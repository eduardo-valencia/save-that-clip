# Extension

## Testing the Extension

See the extension's documentation for more information about testing it. To load the extension, see <https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked>.

### Notes

- You might have to manually reload the extension (and not through <https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid>) if you made changes to the manifest.
- You may have to reload the page if Gulp reloads the extension automatically. Otherwise, the popup might be unable to connect to the content script, and you might receive a message saying, "Receiving end does not exist."

## Manifest

- We need the "tabs" permission to be able to see the URL.
- We install the content script on all Netflix URLs instead of only the episode URLs. This is because we kept getting an error saying "Receiving end does not exist" when we switched between a non-episode Netflix page to an episode and then tried creating a bookmark. Installing the content script on all Netflix URLs seems to fix that.
