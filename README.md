# PieDAO [![Yarn](https://img.shields.io/badge/maintained%20with-yarn-2d8dbb.svg)](https://yarnpkg.com/) [![Styled with Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io) [![Commitizen Friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Monorepo implementing the PieDAO application layer.

## Packages

The PieDAO monorepo is maintained with [Nx](https://nx.dev/getting-started/intro) and [yarn workspaces](https://yarnpkg.com/features/workspaces). Check out the README
associated to each package for detailed usage instructions.

If running in VS code, Nx has a dedicated extension

### Apps

| Apps                                        | Description                                                    |
| ---------------------------------------------- | -------------------------------------------------------------- |
| [`@piedao/example`](/apps/example)             | your app description                        |
| [`@piedao/mono-app`](/apps/mono-app)             | React SPA for interacting with Mono Vaults                        |

### Libs

| Package                                  | Description                                  |
| ---------------------------------------- | -------------------------------------------- |
| [`@piedao/constants`](/packages/constants) | Constants shared across packages        |

## Contributing

Feel free to dive in! [Open](https://github.com/pie-dao/monorepo/issues/new) an issue.
For any concerns or feedback, join us on [Discord](https://discord.piedao.org).

### Pre Requisites
You will need the following software on your machine:

- [Git](https://git-scm.com/downloads)
- [Node.Js](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/getting-started/install)

In addition, familiarity with [TypeScript](https://typescriptlang.org/) and [React](https://reactjs.org/) is requisite.

### Set Up

Install the dependencies:

```bash
$ yarn set version berry 
$ yarn plugin import workspace-tools
$ yarn
```
Now you can start making changes.

### Running command on a single package
```bash
$ yarn workspace [@piedao/ui-atoms] run [build]
```

### Running command on a single package
```bash
$ yarn workspace [@piedao/ui-atoms] run [build]
```