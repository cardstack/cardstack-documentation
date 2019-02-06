# Hub External Dependencies
The Cardstack Hub has a few external dependencies it requires in order to operate correctly. Let’s go through them.
### Docker
Docker is not a required dependency, but we highly recommend it. Docker is a great way to bundle services in simple and composable packages. For the examples below, we will assume that you have Docker installed. You can find installation instructions for Docker [here](https://www.docker.com/get-started).
### Postgres
The Cardstack Hub uses a PostgreSQL database to persist the content index. Additionally, the PostgreSQL DB is used to orchestrate job queues used for indexing.

A PostgreSQL DB can also serve as a data source for content. But for this example, we’ll just be using Ethereum as our data source. 

The Cardstack Hub will automatically try to attach to the default PostgreSQL DB, `postgres://postgres@localhost:5432/postgres`; however, you can specify a PostgreSQL DB using the standard PostgreSQL environment variables (`PGHOST`, `PGPORT`, `PGUSER`, etc), or you can specify a PostgreSQL URL to your database using the environment variable `DB_URL`.

For our example, let’s just use the default PostgreSQL DB. We have provided a handy Docker container that you can use to easily spin up a PostgreSQL database:

`docker run -d -p 5432:5432 --rm cardstack/pg-test`

This will start a PostgreSQL database on port 5432 on your local system.
### Geth
The Cardstack Hub uses [Geth](https://github.com/ethereum/go-ethereum/wiki/geth) as the interface to Ethereum. Geth is a Go implementation of an Ethereum client, and probably the most popular Ethereum client used today.

The simplest way to setup [Geth is to use Docker](https://hub.docker.com/r/ethereum/client-go/). To run Geth, we’ll first setup a folder on your local machine to act as a filesystem volume for Docker.This allows your downloaded Ethereum blocks to persist between Docker container restarts.

`mkdir ~/ethereum`

Now we can start Geth using Docker, and tell Docker that we want to use `~/ethereum` as the filesystem volume.

In this example, we’ll be attaching to the Rinkeby test network. Note that when you provide the path to your volume, you’ll need to use the absolute path. On my machine, `~/ethereum` resolves to `/Users/hassan/ethereum`.

`docker run -d --name ethereum-node -v /Users/hassan/ethereum:/root -p 8545:8545 -p 8546:8546 -p 30303:30303 ethereum/client-go:stable --rinkeby --rpc --rpcapi eth,net,web3 --rpcaddr 0.0.0.0 --ws --wsaddr 0.0.0.0 --wsorigins '*' --wsapi eth,net,web3 --cache 4096`

One item to point out: we are turning on both the RPC interface on port 8545 and the WebSocket interface on port 8546. The Cardstack Hub uses the WebSocket interface of Geth in order to index content from Ethereum.

Geth will now start downloading blocks from the Rinkeby network. Depending on your internet connection this may take a couple hours. You can then use the following command to keep track of the downloading process:

`docker logs -f ethereum-node`

Until Geth has caught up to the latest block, it won’t respond to clients. So you’ll need to wait for Geth to download its blocks. From the Geth logs you can keep track of the block number that is being downloaded and compare it to the latest block on Rinkeby [here](https://www.rinkeby.io/#stats). Once Geth has caught up, it will be ready to use.

In order to make life easier for AWS deployments, we have actually created a Terraform module to deploy a Geth node into AWS. If you are interested, you can find the Terraform module [here](https://registry.terraform.io/modules/cardstack/ethereum-node/aws/).

### Node.js
The Cardstack Hub server is hosted by Node.js, a JavaScript-based server. The Cardstack Hub will automatically run on the Node.js server that hosts your Ember.js application when you execute `ember serve`. Additionally, if you prefer your Cardstack Hub to run on a separate Node.js server, you can start your Cardstack Hub with the command:

`ember hub:start`

This will start your Cardstack Hub on port 3000. You can also supply a `PORT` environment variable to run the Cardstack Hub on a different port. In this particular mode, you can inform the Ember.js application where to find the Cardstack Hub using the `HUB_URL` environment variable, which is set to the URL of your Cardstack Hub server.

For our purposes, it is easiest to allow the Cardstack Hub to use the Node.js server that is hosting your Ember.js application. In this case, we can start the Cardstack Hub using the same command that we use to start our vanilla Ember.js application:

`ember serve`

Now when we start our application we can see the Cardstack Hub starting up:

![hub dependencies](https://docs.cardstack.com/images/hubdependencies.png)

