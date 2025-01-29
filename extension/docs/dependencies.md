# Dependencies

The following explains why some dependencies are installed:

- `@babel/plugin-proposal-private-property-in-object`: This is installed because it appears that some package is internally using it, but is not correctly listing it in its `package.json` file. I installed it directly in our `package.json` to configure something in the application, but then I did not need it. When I tried uninstalling it, the application crashed. Therefore, it seems we need to have it directly installed because a package is using it.
