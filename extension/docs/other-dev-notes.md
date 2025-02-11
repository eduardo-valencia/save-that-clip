# Other Development Notes

## Isolation

Note that the content scripts should not be able to import any code that isn't in the common utilities. For example, it shouldn't be able to import the popup's code. This is because content scripts run in a different environment. If we imported the popup's code, we could accidentally include code that is missing dependencies or cannot be run in the browser's runtime. Note that there are certain APIs that are specific to the popup and cannot be run from content scripts.

**TODO**: See if we can avoid isolating them.

## Debugging Issues

- <https://developer.chrome.com/docs/extensions/get-started/tutorial/debug>
- Some errors can be seen on Sentry

## Opening the Popup

You can open the popup at `chrome-extension://<my_extension_id>/popup.html`.
