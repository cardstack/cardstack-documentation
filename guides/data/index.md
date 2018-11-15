This section is intended to give you an overview of how data is modelled within
Cardstack and how it passes through the system.  

## The Hub
The Cardstack **hub** is the heart of the system and can be considered as a sort
of "cache" of external datasources. If you are developing a Cardstack
application locally making use of the [Ephemeral Datasource](../ephemeral-datasource/)
then it may be hard to visualise the distinction between the hub and an
"external" datasource but hopefully the following section will be able to
outline the concept.

When thinking about how the hub access data, you can consider it as a local
cache system that keeps hold of a local **index** of the data in all of the
configured the data sources. When you hit the JSON:API api for Cardstack you are
**never** hitting an external datasource you are just hitting the index. You
will see this when you look at the middleware that the @cardstack/jsonapi
package provides (middleware is a data-type that a Cardstack plugin can
provide). Looking the jsonapi middleware you can see that all data access goes
through the **searcher** that is injected into the constructor of the
middleware. This means that the jsonapi middleware is just reading the cached
index directly when a request comes in. If you are using the
[@cardstack/pgsearch](https://www.npmjs.com/package/@cardstack/pgsearch)
searcher in your Cardstack application this means you will be using postgres as
our index provider. If you open postgres you will see a documents collection
that contains the data for each card as well as the tsvector (see the [postgres
documentation for
tsvector](https://www.postgresql.org/docs/10/datatype-textsearch.html) for more
information) which is used for the full text search part of the system. To
understand some of the internal structure of a Card document you can read the
[Document Context](../docuemnt-context/) guide.

## Data Flow
A quick overview of the data-flow in the Cardstack hub is that we have
**indexers** to pull data into the local cache, **searchers** to access it and
**writers** that are used to push data back out to the 3rd party data source.
