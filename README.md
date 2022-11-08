# PieDAO [![Styled with Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io) [![Commitizen Friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Monorepo implementing the PieDAO application layer.

## Contributing

Feel free to dive in! [Open](https://github.com/pie-dao/monorepo/issues/new) an issue.
For any concerns or feedback, join us on [Discord](https://discord.piedao.org).

## Prerequisites

You will need the following software on your machine:

- [Git](https://git-scm.com/downloads)
- [Node.Js](https://nodejs.org/en/download/)

The project is build with [Nx](https://nx.dev), so familiarity with Nx monorepos is advised. If using VS code, consider adding the [Nx Console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) extension to get started with a GUI.

In addition, familiarity with [TypeScript](https://typescriptlang.org/) and [React](https://reactjs.org/) is a prerequisite.

## Set Up

You need to install the dependencies:

```bash
npm i
```

The next step is to call the setup script:

```bash
script/setup
```

Next, run patches if any
```bash
patch-package
```


Now you can start making changes.

## Packages

This project contains multiple individual packages that can be deployed separately:

- [Investify](/apps/investify/README.md) is the primary investing application
- [Investify-e2e](/apps/investify-e2e/README.md) lets you run automated e2e tests using Cypress
- [Backend](/apps/backend/README.md) contains the server component of the project.
- [Landing Page](/apps/landing-page/) the landing page
- [SDK](/libs/sdk-utils/) contains a collection of utilities that assist with connecting to on-chain data
- [Funds](/libs/domain/feature-funds/) domain model and business functions for [Funds](GLOSSARY.md#fund)

You can follow the links above to refer to the documentation of those projects.
