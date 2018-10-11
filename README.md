# expensify-api
API access to Expensify, whether through their "Integration Server" or via
puppeteer when the official API doesn't expose a way to do certain actions.

## What about the "expensify" npm package?

The [expensify](https://github.com/brendannee/node-expensify) package utilizes
parts of the expensify API that don't seem to be available anymore. In
particular, it's unclear how to obtain an AES key and "AES IV" for expensify,
or how to set a "user secret" to obtain an SSO. It's likely that the library is
using an older API, as it hasn't been updated in 3+ years at the time of
writing.

## Static Typechecking & Transpiling
This project uses [typescript](https://www.typescriptlang.org).

Files in dist/ are generated with files from src/.
Each .ts file in src/ is split into two files in dist:
  - non-typed, node-executable `.js` file
  - typescript type declaration `.d.ts` file

To transpile from src/ to dist/, use:

```
$ yarn run build
```

To typecheck only, use:

```
$ yarn run typecheck
```

To execute a js file without explicitly compiling, use `ts-node`:

```
$ yarn run ts-node src/some-file.js
```

## Testing

There are no actual unit or integration tests. You can check whether the library
can make basic calls by using `yarn test`. This will invoke non-destructive
commands on the library.

It's not meant to be exhaustive, or even a "real test".