One of the most important things to know about Cards is that there is a tight coupling between the data backing a Card and the presentational aspects of a Card. To say it another way, a Card is made of both visual elements and the data model that describes the attributes of that Card.

In this section, you will learn how to say what kind of data to render for a Card, and how to make sample data that you can use while you are working on a new card.

## Defining a Schema

Every Card has a schema, where the types of data the card relies on are defined.
For example, a blog post Card might have a title, description, publish date, topic, and more.
The schema is where you would list those attributes and their types, as well as create seed data.

### The default schema

Each Card has its own schema, found in `my-card-name/cardstack/static-model.js`.
This is the file where you will add your own attributes to a Card.
When a card is first generated, its `static-model.js` will look like this:

```js
const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');

let factory = new JSONAPIFactory();
factory.addResource('content-types', 'my-card-names')
  .withRelated('fields', [
    factory.addResource('fields', 'title').withAttributes({
      fieldType: '@cardstack/core-types::string'
    })
  ]);

let models = factory.getModels();
module.exports = function() { return models; };
```

When a Card of the type `my-card-names` is created, it has a default property of `title`, which is a string. the `JSONAPIFactory` helps to format the Card definition into something that the Card SDK's data adapters can use.

## Adding `@core-types` to a schema

A Card often has many more different attributes, of many different data types like strings, dates, and booleans. The Card SDK has some built-in types for the most common kinds of data, known as `core-types`.

Here's an example Card with more attributes than just a `title`:

```js
const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');

let factory = new JSONAPIFactory();
factory.addResource('content-types', 'photos')
  .withRelated('fields', [
    factory.addResource('fields', 'title').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),
    factory.addResource('fields', 'description').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),
    factory.addResource('fields', 'views').withAttributes({
      fieldType: '@cardstack/core-types::integer'
    }),
    factory.addResource('fields', 'created-at').withAttributes({
      fieldType: '@cardstack/core-types::date'
    }),
  ]);

let models = factory.getModels();
module.exports = function() { return models; };
```

### List of all core types

There are many different core types available. 
An attribute can be defined like `fieldType: '@cardstack/core-types::<type>'`,
where `type` is one of these: 

* `string` _(ex. `"sandwich", "Dave"`)_
* `string-array` _(ex. `["red", "green", "blue"]`)_
* `case-insensitive` case insensitive string, used for email addresses, among other things _(ex. `"CardSDK@cardstack.com"`)_
* `integer` _(ex. `37`)_
* `boolean` _(ex. `true`)_
* `date` _(ex. `"2018-07-22"`)_
* `object` _(ex. `{ flower: 'rose' }`)_
* `any` any data type, useful for external data sources
* `belongs-to` belongs to relationship to another content-type _(ex. `"author"`)_
* `has-many` has many relationship to another content-type _(ex. `"pets"`)_

You can learn more about core types in the [`@cardstack/core-types`](https://github.com/cardstack/cardstack/tree/master/packages/core-types) source code.

### Custom types

If you need to show data that is more complex than the `core-types` cover,
the Card SDK has some built-in, such as `@cardstack/mobiledoc`, or you can write your own!

To write your own custom `fieldType`, see the source code for [`@cardstack/core-types`](https://github.com/cardstack/cardstack/tree/master/packages/core-types) and [`@cardstack/mobiledoc`](https://github.com/cardstack/cardstack/tree/master/packages/mobiledoc) for inspiration.

## Adding seed data

When you are first developing a Card, it's useful to create some sample data to show in a template.
You can use the `JSONAPIFactory` to make seed data, right in the `static-models.js` file.

For example, let's say we have a `photographer` card, and we want to pre-load some `photographers` to show in the app:

```js
const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');

let factory = new JSONAPIFactory();
factory.addResource('content-types', 'photographers')
  .withRelated('fields', [
    factory.addResource('fields', 'name').withAttributes({
      fieldType: '@cardstack/core-types::string'
    })
  ]);

factory.addResource('photographer', 1).withAttributes({
  name: 'Ansel Adams'
});

let models = factory.getModels();
module.exports = function() { return models; };
```



In this file, we've created a photographer record with an `id` of one, and the photographer's name is Ansel Adams. Later, we will use the `id` in order to navigate to the Card in the browser, and then display the name.

At this point, it's a good idea to move ahead to the next part of the Guides, where you will try writing a template, start up the Cardstack environment, and see your Card's data in the browser. Keep reading if you want to know about more advanced schema features.

## Advanced schema features

What else can a Card's schema do? The schema is the place to:

- Show that a field should be editable using a specific form tool
- Create relationships between Card data. For example, a `photographer` might have many `photos`.
- Say that another Card's data should be loaded together with this Card
- Include Computed Fields. They are calculated on the server and update when the data changes.

### Example advanced schema

Here's an example of advanced schema for blog articles in the
[Cardboard](https://github.com/cardstack/cardboard/blob/master/cards/article/cardstack/static-model.js) demo project:

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

### Advanced schema features explained

Let's dig a little deeper into the example above.

#### `editorComponent` and Field Editors

Cardstack has some built-in content editing tools. If your Card will use them,
you will need to specify the correct `editorComponent` that goes with a field tupe.

For example, if your `fieldType` is `@cardstack/core-types::string`, the `field-editors/string-editor` (which is essentially just a bound `<input type="text">`) will be used. The core-types package contains several built-in field editors (`string`, `integer`, `date`, etc), but you can specify your own custom field editor by specifying `editorComponent`. This is particularly useful for relationship field types, for which there may not be a "standard" UI:

```js
factory.addResource('fields', 'author').withAttributes({
  fieldType: '@cardstack/core-types::belongs-to',
  editorComponent: 'field-editors/author-picker'
})
```

Additionally, you can pass options to field editors using `editorOptions`:

```js
factory.addResource('fields', 'is-admin-user').withAttributes({
  fieldType: '@cardstack/core-types::boolean',
  editorOptions: { style: 'switch' }
})
```

You can learn more about field editors in the [`@cardstack/core-types`](https://github.com/cardstack/cardstack/tree/master/packages/core-types) source code.

#### `defaultIncludes` Isolated and Embedded

Cards can be displayed in one of two modes, `isolated` and `embedded`.
Depending on where a Card is viewed from, different data may be fetched and displayed.

#### `withRelated` and `defaultIncludes`

Cards can have relationships to other Cards' data types. For example,
an `article` might belonging to an `author`, or multiple `authors`.
To jump ahead and learn more, see [Relationships](../../deck/relationships/).

#### `fieldsets`

Cards can have many properties, and the need to display these properties might change according to which mode the card is in use. For example, a user would most likely want to see only a short description of an article in the `embedded` mode, while they need to see the entire body in the `isolated` mode. In this case, `fieldsets` will look like this:
```js
fieldsets: {
      embedded: [
        { field: 'title', format: 'embedded'},
        { field: 'published-date', format: 'embedded'},
        { field: 'description', format: 'embedded' },
      ],
      isolated: [
        { field: 'title', format: 'embedded' },
        { field: 'published-date', format: 'embedded' },
        { field: 'body', format: 'embedded'},
      ]
    }
```