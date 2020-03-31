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

### Node.js

The Cardstack Hub server is written in Node.js.
