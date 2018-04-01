# expensify-integration
API access to the Expensify Integration Server

## Static Typechecking & Transpiling
This project uses (flow types)[https://flow.org].

Files in dist/ are generated with files from src/.
Each .js file in src/ is split into two files in dist:
  - non-typed, node-executable .js file
  - flow-type declaration .js.flow file

To transpile from src/ to dist/, use:

```
$ yarn run build
```

To typecheck only, use:

```
$ yarn run flow
```

To execute a js file without explicitly compiling, use `node-babel`:

```
$ yarn run node-babel src/some-file.js
```

## Testing

There are no actual unit or integration tests. You can check whether the library
can make basic calls by using `yarn test`. This will invoke non-destructive
commands on the library.

It's not meant to be exhaustive, or even a "real test".