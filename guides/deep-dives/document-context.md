This article is about Cardstack internals, and is meant for developers
who want to contribute directly to the framework code.

If you are using the
[`@cardstack/pgsearch`](https://www.npmjs.com/package/@cardstack/pgsearch)
searcher in your Cardstack application and taken a look at the objects generated
in your local postgres database you may have noticed the three columns
`pristine_doc`, `search_doc` and `upstream_doc`. These three columns represent
the three main **Document Contexts** that are used internally. It is unlikely
that you will work with them directly as an end-user (unless you are developing
a Cardstack plugin) but it is important to understand the difference between
them so that you can get a feel for how your Card Documents are used internally
by the system and you will know which fields are searchable.

## Pristine Document

The Pristine Document (often referred to as `pristineDoc` in the code) is
supposed to represent the whole document and all relationships that are
configured in the datatype's `defaultIncludes` definition. This representation
of the document will be a deeply-nested data structure that should hold most
relationships (all of the relationships that are listed in `defaultIncludes`)
and most of those related documents' relationships and so on. This is quite a
useful representation of the full tree of related documents because it allows
very fast access to documents and their related documents.

## Search Document

The Search Document (often referred to as `searchDoc`) is very similar to the
Pristine Document, in that it can include a deep chain of relationships to other
documents but with one important difference: the Search Document does not
include fields or relationships that have been marked as *not-searchable*.

When defining fields you can explicitly mark that field as not searchable as follows:

```javascript
let factory = new Factory();

factory.addResource('content-types', 'event')
  .withRelated('fields', [
    factory.addResource('fields', 'name').withAttributes({
      fieldType: '@cardstack/core-types::string',
    }),
    factory.addResource('fields', 'description').withAttributes({
      fieldType: '@cardstack/core-types::string'
      searchable: false
    }),
  ]);
```

When dealing with the Document Context of an event document from this example,
the _Pristine Document_ will include both of the fields `name` and `description`
but the _Search Document_ will only contain the `name` field. In this example
use case the intention is that you should be able to use the Cardstack searcher
functionality to find events based on their names, but any search for an event
by their description would be impossible.

Note this code sample above is using the
[`@cardstack/test-support`](https://www.npmjs.com/package/@cardstack/test-support)
`jsonapi-factory` to build the JSON:API definition of the content-type

## Upstream Document

Your Cardstack
application can be configured with multiple data sources. While this
documentation may sometimes refer to these as "External Data Sources" it is
important to know that in most cases **all** data sources are considered external
to the Cardstack Hub. For example, if you have configured [`@cardstack/git`](https://www.npmjs.com/package/@cardstack/git) to point at a git repository
on the same machine that is running your Cardstack application, from the
Cardstack Hub's perspective that is no different from configuring the
`@cardstack/git` data source to point at a remote git repository.

The Upstream Document is intended to be a representation of the state of a
document in the External Data Source. Because of this it will not contain any
nested relationships that have been constructed by the Cardstack Hub.
