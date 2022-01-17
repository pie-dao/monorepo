<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app
Create a .env file inside the root of the project, with this content
(remember to change "YOUR_INFURA_KEY_HERE" with your actual Infura's Key, and follow the steps described in the Test section regarding the setup for the docker-mongoDB on your local environment)

```bash
NODE_ENV=development
NPM_CONFIG_PRODUCTION=false
MONGO_DB=mongodb://piedao:piedao@localhost:27017/admin
MONGO_DB_TEST=mongodb://piedao:piedao@localhost:27017/admin
INFURA_RPC=https://mainnet.infura.io/v3/YOUR_INFURA_KEY_HERE
PIE_GETTER_CONTRACT=0xeDF74D4c543b6c32e9ee9E8bD5fd9e6d5Bd4F546
GRAPH_URL=https://api.thegraph.com/subgraphs/name/pie-dao/vedough
SNAPSHOT_SPACE_ID=piedao
TREASURY_ADDRESS=0x3bcf3db69897125aa61496fc8a8b55a5e3f245d5
ZAPPER_API_KEY=YOUR_ZAPPER_KEY_HERE
```

Once done, you'll be able to run the project locally by doing

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test
In order to be able to quickly test the whole project, we strongly recommend you to use a local mongoDB on a docker.
Supposing you have docker already installed, all you need to do is

```bash
# install the mongoDB docker, and initialize it as follows
docker run --name mongodb -d -e MONGO_INITDB_ROOT_USERNAME=piedao -e MONGO_INITDB_ROOT_PASSWORD=piedao -e MONGO_INITDB_DATABASE=PieDAOTesting -p 27017:27017 mongo

# add this to your local .env file
MONGO_DB_TEST=mongodb://piedao:piedao@localhost:27017/admin
```

Once this setup is done, you can then run the tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Playground
Once running it locally, you can go to
http://localhost:3000/playground/
and test it out.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
