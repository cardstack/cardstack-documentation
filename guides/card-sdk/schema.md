Every Card has a schema, where the types of data the card relies on are defined.
Does the Card's data have names, titles, descriptions, dates, etc?
The schema is where you list the attributes and their types, so that
later on you can show the data in a template.

If you look in an individual Card's `cardstack` directory, that is where you will
find the schema.

## An example schema

First, let's look at the schema for a blog article in the
[Cardboard](https://github.com/cardstack/cardboard/blob/master/cards/article/cardstack/static-model.js) demo project. We'll break down what this file is doing in the following sections.

```js
// cardboard/cards/article/cardstack/static-model.js
const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');

let factory = new JSONAPIFactory();
factory.addResource('content-types', 'articles')
  .withAttributes({
    defaultIncludes: ['cover-image', 'theme', 'category', 'author'],
    fieldsets: {
      embedded: [
        { field: 'cover-image', format: 'embedded'},
        { field: 'cover-image.file', format: 'embedded'},
        { field: 'theme', format: 'embedded' },
        { field: 'category', format: 'embedded' },
      ],
      isolated: [
        { field: 'theme', format: 'embedded' },
        { field: 'category', format: 'embedded' },
        { field: 'cover-image', format: 'embedded'},
        { field: 'cover-image.file', format: 'embedded'},
      ]
    }
  })
  .withRelated('fields', [
    factory.addResource('fields', 'slug').withAttributes({
      editorOptions: { headerSection: true, sortOrder: 150 },
      caption: 'URL Path',
      editorComponent: 'field-editors/url-path',
      fieldType: '@cardstack/core-types::string'
    }),

    factory.addResource('fields', 'title').withAttributes({
      editorOptions: { headerSection: true, sortOrder: 10 },
      fieldType: '@cardstack/core-types::string'
    }),

    factory.addResource('fields', 'subhead').withAttributes({
      fieldType: '@cardstack/core-types::string',
      editorComponent: 'field-editors/string-text-area'
    }),

    factory.addResource('fields', 'description').withAttributes({
      fieldType: '@cardstack/core-types::string',
      editorComponent: 'field-editors/string-text-area'
    }),

    factory.addResource('fields', 'body').withAttributes({
      fieldType: '@cardstack/mobiledoc'
    }),

    factory.addResource('fields', 'created-date').withAttributes({
      editorOptions: { headerSection: true, sortOrder: 120, hideTitle: true },
      editorComponent: 'field-editors/created-date',
      fieldType: '@cardstack/core-types::date',
    }),

    factory.addResource('fields', 'published-date').withAttributes({
      fieldType: '@cardstack/core-types::date',
      editorOptions: { headerSection: true, sortOrder: 30 },
      caption: 'Published',
      editorComponent: 'field-editors/publish-toggle'
    }),
// and more
]);

let models = factory.getModels();
module.exports = function() { return models; };

```

## The big picture

So what is this file trying to accomplish? The job of a schema is to
return a description of a Card's data, following [JSON:API](https://jsonapi.org/) format. When a request is made for the article Card's data, it would look something like this:

```json
{
    "id": "experience-layer",
    "type": "articles",
    "attributes": {
        "slug": "experience-layer",
        "title": "Interview: What is the 'Experience Layer'?",
        "description": "Chris joins the hosts of the Bad Crypto podcast to explain how Cardstack is the missing piece of the decentralized Internet",
        "body": {...},
        "created-date": "2019-03-15T03:43:02.992Z",
        "published-date": "2019-03-15T03:43:02.992Z",
        "is-draft": false,
        "author-name": "Chris Tse"
}
```

## JSONAPIFactory

`JSONAPIFactory` is a module provided by `@cardstack/test-support`.
JSON is hard for people to read and write by hand, so the factory
provides a convenient, concise way to specify some attributes.

`factory.addResource()` takes two arguments, a type and the key name for the attribute.

In the example above, we create a `content-type` called `articles`. By convention, content types are plural. Content types are the very broad descriptors for a record type, such as articles, authors, etc.

Then, we added attributes to the `articles`, like `title`, `description`, and `body`.

## Field types

Each attribute on our `article` needs a `fieldType` that describes the kind of data that the attribute will have. Is it a string? A date? Or something complex like content formatted with [mobiledoc](https://bustle.github.io/mobiledoc-kit/demo/)?

### Core types

Core types are simple data types provided by Cardstack.
They can be specified like `fieldType: '@cardstack/core-types::<type>'`,
where `type` is one of these: 

* `string` _(ex. `"sandwich", "Dave"`)_
* `string-array` _(ex. `["red", "green", "blue"]`)_
* `case-insensitive` case insensitive string, used for email addresses, among other things _(ex. `"ChRiS.tSe@GmaiL.com"`)_
* `integer` _(ex. `37`)_
* `boolean` _(ex. `true`)_
* `date` _(ex. `"2018-07-22"`)_
* `object` _(ex. `{ flower: 'rose' }`)_
* `any` any data type, useful for external data sources
* `belongs-to` belongs to relationship to another content-type _(ex. `"author"`)_
* `has-many` has many relationship to another content-type _(ex. `"pets"`)_

You can learn more about core types in the [`@cardstack/core-types`](https://github.com/cardstack/cardstack/tree/master/packages/core-types) source code.

### Advanced types

If you need to show data that is more complex than the `core-types` cover,
Cardstack has some built-in tools like `@cardstack/mobiledoc`.
These are known as "plugins." If you would like to
write your own `fieldType`, see the source code for [`@cardstack/core-types`](https://github.com/cardstack/cardstack/tree/master/packages/core-types) and [`@cardstack/mobiledoc`](https://github.com/cardstack/cardstack/tree/master/packages/mobiledoc) for inspiration.

## `editorComponent` and Field Editors

Cardstack has some built-in content editing tools. If your Card will use them,
you will need to specify the correct `editorComponent` that goes with a field tupe.

For example, if your `fieldType` is `@cardstack/core-types::string`, the `field-editors/string-editor` (which is essentially just a bound `<input type="text">`) will be used. The core-types package contains several built-in field editors (`string`, `integer`, `date`, etc), but you can specify your own custom field editor by specifying `editorComponent`. This is particularly useful for relationship field types, for which there may not be a "standard" UI:
```
factory.addResource('fields', 'author').withAttributes({
  fieldType: '@cardstack/core-types::belongs-to',
  editorComponent: 'field-editors/author-picker'
})
```
Additionally, you can pass options to field editors using `editorOptions`:
```
factory.addResource('fields', 'is-admin-user').withAttributes({
  fieldType: '@cardstack/core-types::boolean',
  editorOptions: { style: 'switch' }
})
```

You can learn more about field editors in the [`@cardstack/core-types`](https://github.com/cardstack/cardstack/tree/master/packages/core-types) source code.

## `withRelated` and `defaultIncludes`

Cards can have relationships to other Cards' data types. Continue on to the
next section to learn more!
