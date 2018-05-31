# expensify-integration
API access to the Expensify Integration Server

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