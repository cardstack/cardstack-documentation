When a developer defines a new, custom data source for their Cards, they need to ask themselves the following questions:

- What data should be fetched and cached?
- How often should the cache be refreshed?
- What kinds of searches would be made on the cache?
- If data should be changed, where does that request go, and what is the format?
- Who should have the ability to read and/or write data?

In Cardstack, we have grouped these various tasks into indexers, searchers, writers, and authenticators within the data plugins.

To see an example of a data plugin, check out the [`@cardstack/ephemeral`](https://github.com/cardstack/cardstack/tree/master/packages/ephemeral) plugin.

## Anatomy of a data plugin

A data plugin is usually made up of up to four main features:

1. Indexer - an asynchronous process that fetches data from external sources, does some JSON preprocessing, and add the data into an index to allow for quick access when the front end requests for it.
2. Searcher - when querying/fetching data from the front end, the searcher will access the data from the index.
3. Writer - when the front end sends a POST/PATCH request (want to write back to the data source), the writer handles that.
4. Authenticator - handles authenticating the app or user to retrieve data

In the following sections, we'll cover the available commands for these data sources.

## Indexer

An indexer fetches data on a regular interval and indexes it into a cache for speedy retrieval. The source code for the Indexer class can be found [here](https://github.com/cardstack/cardstack/blob/master/packages/hub/indexers.js).

### `update`

The update method is responsible for getting any new upstream content into
the search index. Update takes these optional arguments:

- `forceRefresh`: when true, we will force Elasticsearch to index
the new content immediately. This is expensive if you do it
too often. When false, we will wait for the next scheduled
refresh to happen (the default Elasticsearch refresh_interval
is once per second). Defaults to false.
- `hints`: can contain a list of `{ id, type }`
references. This is intended as an optimization hint when we
know that certain resources are the ones that likely need to be
indexed right away. Indexers are responsible for discovering and
indexing arbitrary upstream changes regardless of this hint, but
the hint can make it easier to keep the search index nearly
real-time fresh.

### `schema`

`schema()` retrieves the Schema for a Card.

A Schema instance is computed from all the schema models
that are discovered. Schema models are things like
`content-types`, `fields`, `data-sources`, `plugin-configs`,
etc. They are pieces of content, but special pieces of content
that can alter how other content gets indexed.
This method does it own caching, since schemas get computed as
part of indexing anyway. You can also directly invalidate the
cache, see next method.

### `invalidateSchemaCache`

`invalidateSchemaCache()` does what it says on the
tin. This is a lighter-weight operation than `update`. It allows
us to decouple the question of when and how to index content
from the issue of maintaining schema correctness during
sequences of writes.

## Writer

Writers have three main functions: `create`, `update`, `schemaTypes`, and `delete`. You can view the source code for the Writer class [here](https://github.com/cardstack/cardstack/blob/master/packages/hub/writers.js).  

## Searcher

Searchers handle GET requests to the cache. The source code for the Searcher class can be found [here](https://github.com/cardstack/cardstack/blob/master/packages/hub/searchers.js).

## Authenticator

Authentication strategies vary significantly across projects.
To see a sample authenticator, see the [Portfolio](https://github.com/cardstack/portfolio/blob/master/cards/user/cardstack/authenticator.js) source code.
