# Backend

## Running the app

Create a .env file inside the root of the project, with this content
(remember to change `"YOUR_INFURA_KEY_HERE"` and `YOUR_ZAPPER_KEY_HERE` with your actual API keys and follow the steps described in the Test section regarding the setup for the docker-mongoDB on your local environment).

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

Once you set this up you can build the project by running

```
script/build-all
```

and then you can use

```
script/serve backend
```

to have a development version of the backend served (with hot code replace).

For a production build you can simply call

```
script/run backend
```

> 📙 Note that `script/run` will only work after a `script/build` is performed.

## Heroku Deployment

> 📘 Note that we already have some deployments on Heroku. If you want to use them
> you don't need to create your own ones! These are the remotes that we have deployed:
> staging: `https://git.heroku.com/piedao-backend-stage.git`
> prod: `https://git.heroku.com/piedao-nestjs.git`

If you want to deploy an instance to _Heroku_, these are the necessary steps:

> 📙 Make sure that you call `heroku login` before trying to do this. You'll also need the Heroku CLI installed

First, we create the app on Heroku:

```bash
heroku create <pick-an-app-name> --remote <pick-a-remote-name> # --team if you use teams
```

Now you need to add the [multi-procfile buildpack](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-multi-procfile) to them.

This is because Heroku assumes that you have one app per repo by default, and this enables to have multiple `Procfile`s (deployments) in a repo

```bash
heroku buildpacks:add --app <app-name-you-picked> heroku-community/multi-procfile
```

Of course this won't work because Heroku doesn't know about node, so we need to add the node buildpack too:

```bash
heroku buildpacks:add --app <app-name-you-picked> heroku/nodejs
```

Then we'll have to tell Heroku where these `Procfile`s are:

```bash
heroku config:set --app <app-name-you-picked> PROCFILE=apps/backend/Procfile
```

Then we'll need to add a `heroku-postbuild` script to override the default build behavior of Heroku and let it build the project we need. This goes into the `package.json` in the root folder:

> 📘 We already have this in `package.json`, we include this instruction here so that you know how this works.

````bash

```json
scripts: {
  "heroku-postbuild": "script/heroku-build $PROJECT_NAME"
}
````

> 📘 A note on the `script` folder: this project follows the [Scripts to Rule them All](https://github.com/github/scripts-to-rule-them-all) guidelines.
> You'll find scripts for most tasks that you might want to execute there. If you call a script you'll see some documentation too.

Heroku needs to know the value of `$PROJECT_NAME` for each deployment so let's set it:

```bash
heroku config:set --app <app-name-you-picked> PROJECT_NAME=backend
```

If you need to set any configuration values (like `MONGO_DB`) you can do it like this:

```bash
heroku config:set MONGO_DB=<mongo-url> --remote <your-remote>
```

Finally, we push it to _Heroku_

> 📙 Don't forget to commit your changes before pushing 😅. Also make sure that you're on the fully up-to-date `main` branch.

```bash
git push <your-remote> main
```

## Troubleshooting

There are some known issues with the project that are outlined here:

- There is a bandwidth bottleneck between the app and Atlas, so make sure that if you are running queries that return huge payloads (eg: `>1MB`) then please use projections to limit the size of the payload (only query the fields you read).

## Test

In order to be able to quickly test the whole project, we strongly recommend you to use a local mongoDB in Docker.

If you have Docker and Docker-compose already installed, all you need to do is run:

```bash
nx run mongodb-up
```

```bash
# add this to your local .env file
MONGO_DB_TEST=mongodb://piedao:piedao@localhost:27017/admin
```

Once this setup is done, you can then run the tests

```bash
# unit tests
$ npm run test
```

> 📘 The coverage will be recorded in `coverage/apps/backend` if you add the `--collect-coverage` flag

## API Playground

Once running it locally, you can go to
http://localhost:3000/playground/
and test it out.

## PieDAO Investify Token Aggregator (PITA)

The _backend_ serves as the backend for the Investify application. These features are implemented as Nest modules and the architecture looks like this:

![PITA Architecture](pie_backend_architecture.png)

The goal of this project is to

- load the blockchain data from the PieDAO vaults to store the latest state
- load token data from the blockchain (using _The Graph_)
- load price data from CoinGecko

The app uses all this data to present an aggregated state of the world and also to allow for creating simulations based on this data.

### Architecture

#### SDK

The project contains an SDK that can be used to load information from the blockchain in an effective manner (using _multicall_ and also allowing for multichain calls).

The SDK allows for the usage of `Contract` classes that are generated from ABIs.

#### Data Loading

*Data loader*s come in multiple kinds

- An _SDK loader_ uses the _`SDK`_ to load the state of the blockchain
- A _Graph loader_ uses _GraphQL_ to load token data
- A _HTTP_ loader can load data from external _HTTP_ endpoints

*Data loader*s are run periodically using a `Scheduler`. The information is persisted into the database (MongoDB at the time of writing).

#### Domain model

This multi-faceted data structure is represented by a domain model _(blue boxes with in a dotted box on the diagram)_

The data in the domain model can be queried through a GraphQL API.

Apart from the blockchain state, the _(read)_ operations are also available as part of the _Fund Operations_ code.

The `User` of the application is represented by the `User` type. Each _user_ can own multiple `Fund`s and `Token`s, and we also store user events _(things they did on the UI)_ in the database.

#### Event Bus

The `backend` contains an _Event bus_ that can be used as indirect communication with other parts of the application _(publish / subscribe pattern)_ This can be used to trigger events from loaders and to receive user events as well.

#### Simulator

The `Simulator` can be used to create new `Fund` objects to test out theories. Simulation works as follows:

- A new `Fund` is created with abitrary data _(underlying tokens, ratios, etc)_
- Triggers are added to the `Simulation` that will evaluate the token time series data. This can be used to change the state of the `Fund` _(for example if the weight of a token goes above 50% trigger a rebalancing)_
- Then the `Simulator` uses a repository to supply the token data to the `Simulation` which will keep chaning the state of the underlying `Fund` as the simulation goes. All these changes are recoderd as a list of snapshots with the corresponding trigger event:

![The Simulator](the_simulator.png)

## Generating Epochs for SLICE Distribution

Once each month we generate a new epoch for the SLICE distribution. There is a test in the codebase that can be used to do so. It is located at [src/staking/test/monthly.distribution.spec.ts](src/staking/test/monthly.distribution.spec.ts).

> 📘 It was invoked from the CLI back in the day but since the nx migration the CLI commands don't work, so that's
> why we have the test.

The inputs of the following:

```ts
const month = 5;
const year = 2022;
const blockNumber = 14881677;
const distributedRewards = '149744.16892452948';
const windowIndex = 8;
const proposalsIdsToExclude = [
  '0x07cdffdae0321c8f939a54648ca7671b880f024af0f4bb6a190d468ffa0d93b7',
];
```

Whenever it is time to do the SLICE distribution there will be a thread on Discord where the info will be shared.
It looks like this:

![SLICE Distribution](https://cdn.discordapp.com/attachments/583323797969436672/984027011334950922/unknown.png)

The list of **non-eligible** vote ids needs to be put in `proposalsIdsToExclude`.

At some point the pie report will be generated and there will be an epoch configuration in it. It looks
like [this](https://github.com/pie-dao/pie-reporter/pull/12/files#diff-e9df6e8815e6a81ebe181ff2e40b4c8f12611fbfbddfe134c8a54e3905c0c78c):

```json
{
  "date": "2022-5",
  "start_timestamp": 1651356000,
  "end_timestamp": 1654034399,
  "block_snapshot": 14881677,
  "distribution_window": 8,
  "slice_to_distribute": "149744.16892452948"
}
```

The mapping is the following:

```ini
blockNumber        = distribution_window
distributedRewards = slice_to_distribute
windowIndes        = distribution_window
```

Year is the current year, and month is the last month. So in June distribution you'll use May (`5`).

When you have the numbers start the test with the `MONGO_DB_TEST` env var set to the production MongoDB url:

> 📙 This is suboptimal, but right now this is how we do it

```
MONGO_DB_TEST='<the_url_to_prod_db> 'cd '/path/to/monorepo'
node 'node_modules/.bin/jest' '/path/to/monorepo/apps/backend/src/staking/test/monthly.distribution.spec.ts' -c '/path/to/monorepo/apps/backend/jest.config.ts' -t 'StakingService Use this test to generate a new epoch'
```

This will create a new entry in the `epochentities` collection and it will also print out the resulting epoch.

> 📙 Check the type of `merkleTree.windowIndex` in the database. Unfortunately this code is untyped and sometimes you get strings and sometimes numbers. 🤷‍♂️ If it blows try to modify the type.

You need to put this in a file, and share it in the thread.

You're done.
