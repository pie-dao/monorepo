# PieDAO [![Styled with Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io) [![Commitizen Friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Monorepo implementing the PieDAO application layer.

## Contributing

Feel free to dive in! [Open](https://github.com/pie-dao/monorepo/issues/new) an issue.
For any concerns or feedback, join us on [Discord](https://discord.piedao.org).

## Prerequisites

You will need the following software on your machine:

- [Git](https://git-scm.com/downloads)
- [Node.Js](https://nodejs.org/en/download/)

In addition, familiarity with [TypeScript](https://typescriptlang.org/) and [React](https://reactjs.org/) is a prerequisite.

## Set Up

You need to install the dependencies:

```bash
yarn set version berry
yarn plugin import workspace-tools
yarn
```

The next step is to call the setup script:

```bash
script/setup
```

Now you can start making changes.

## Packages

This project contains multiple individual packages that can be deployed separately:

- [Backend](/apps/backend/README.md) contains the server component of the project.
- [Landing Page](/apps/landing-page/) the landing page

You can follow the links above to refer to the documentation of those projects.
