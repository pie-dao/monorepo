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


## Deploy the App

This app runs on Heroku, deploy is pretty simple.

First you login into heroku:
```bash
$ heroku login
```

then you move into the backend folder:
```bash
$ cd apps/backend
```

once there, you can add the heroku repository:
```bash
$ git remote add heroku https://git.heroku.com/piedao-nestjs.git
```

finally, you can simply commit/push on this repo to trigger the build process
```bash
$ git commit -am "love piedao"
$ git push heroku master
```


## Test

In order to be able to quickly test the whole project, we strongly recommend you to use a local mongoDB in Docker.

If you have Docker already installed, all you need to do is

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
```

> 📘 The coverage will be recorded in `coverage/apps/backend` if you add the `--collect-coverage` flag


## API Playground

Once running it locally, you can go to
http://localhost:3000/playground/
and test it out.


## PieDAO Investify Token Aggregator (PITA)

The *backend* serves as the backend for the Investify application. These features are implemented as Nest modules and the architecture looks like this:

![PITA Architecture](pie_backend_architecture.png)

The goal of this project is to

- load the blockchain data from the PieDAO vaults to store the latest state
- load token data from the blockchain (using *The Graph*)
- load price data from CoinGecko

The app uses all this data to present an aggregated state of the world and also to allow for creating simulations based on this data.

### Architecture


#### SDK

The project contains an SDK that can be used to load information from the blockchain in an effective manner (using *multicall* and also allowing for multichain calls).

The SDK allows for the usage of `Contract` classes that are generated from ABIs.


#### Data Loading

*Data loader*s come in multiple kinds

- An *SDK loader* uses the *`SDK`* to load the state of the blockchain
- A *Graph loader* uses *GraphQL* to load token data
- A *HTTP* loader can load data from external *HTTP* endpoints

*Data loader*s are run periodically using a `Scheduler`. The information is persisted into the database (MongoDB at the time of writing).


#### Domain model

This multi-faceted data structure is represented by a domain model *(blue boxes with in a dotted box on the diagram)*

The data in the domain model can be queried through a GraphQL API.

Apart from the blockchain state, the *(read)* operations are also available as part of the *Fund Operations* code.

The `User` of the application is represented by the `User` type. Each *user* can own multiple `Fund`s and `Token`s, and we also store user events *(things they did on the UI)* in the database.


#### Event Bus

The `backend` contains an *Event bus* that can be used as indirect communication with other parts of the application *(publish / subscribe pattern)* This can be used to trigger events from loaders and to receive user events as well.


#### Simulator

The `Simulator` can be used to create new `Fund` objects to test out theories. Simulation works as follows:

- A new `Fund` is created with abitrary data *(underlying tokens, ratios, etc)*
- Triggers are added to the `Simulation` that will evaluate the token time series data. This can be used to change the state of the `Fund` *(for example if the weight of a token goes above 50% trigger a rebalancing)*
- Then the `Simulator` uses a repository to supply the token data to the `Simulation` which will keep chaning the state of the underlying `Fund` as the simulation goes. All these changes are recoderd as a list of snapshots with the corresponding trigger event:

![The Simulator](the_simulator.png)
