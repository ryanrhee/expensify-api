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