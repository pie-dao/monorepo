# PieDAO Subgraph
This is the official PieDAO Subgraph veDOUGH, taking care about staking/holders/rewards.
https://thegraph.com/explorer/subgraph/pie-dao/vedough

## Important Notes
- when you automagically generate the code from an existing proxied contract, you should first generate the code using the original contract address, and then change the address to the proxied one into the subgraph.yaml file.
- when you are testing locally, it is important to properly configure the file under graph-node/docker/docker-compose.yml, and to set the environment:ethereum url to a correct working one.
```
  ethereum: 'mainnet:https://eth-mainnet.alchemyapi.io/v2/U2OZB5LIk2SMDk7eXa218Y24WDTRd5Ze'
  # ethereum: 'rinkeby:https://eth-rinkeby.alchemyapi.io/v2/xFSk4OZFkMNAlp1Pa2f3V-7kdifh5_p5'
  # ethereum: 'goerli:https://eth-goerli.alchemyapi.io/v2/tthz_aiv9toEEiltOBimDytaged_q-Rc'
```
- when it comes to build relations (one-to-one, one-to-many) if we use derived fields we must keep in mind that derived fields are built at query time, and not at indexing time. In other words, the array does not exist when the mapping code runs, so we can't operate with the array as we would normally do.

## how-to
be sure you have docker installed and running, then from root project dir run:
```bash
yarn workspace @apps/the-graph start-graph
```

install the dependencies for each subgraph:
```
yarn workspace @apps/the-graph vedough-install
yarn workspace @apps/the-graph pies-install
```

once your local docker instance is running, then you can build&run the graph of your interest (either )
```bash
cd piedao-subgraph-vedough
yarn codegen && yarn create-local && yarn deploy-local
```