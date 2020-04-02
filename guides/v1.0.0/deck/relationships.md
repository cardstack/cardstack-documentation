Cards can have relationships to other cards, as defined in their [Card Schema](../../card-sdk/schema/).

Relationships can be specified using the `belongs-to` and `has-many` core types, as shown in the example below from the [Portfolio](https://github.com/cardstack/portfolio/tree/v0.14.49/cards) project:

```js
const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');

let factory = new JSONAPIFactory();
factory.addResource('content-types', 'wallets')
  .withAttributes({
    defaultIncludes: [
      'assets',
      'assets.network-asset',
      'user',
      'todays-rates-lookup',
      'todays-rates-lookup.rates',
    ],
    fieldsets: {
      embedded: [
        { field: 'assets', format: 'embedded' },
        { field: 'todays-rates-lookup', format: 'embedded' },
        { field: 'todays-rates-lookup.rates', format: 'embedded' },
      ],
      isolated: [
        { field: 'assets', format: 'embedded' },
        { field: 'todays-rates-lookup', format: 'embedded' },
        { field: 'todays-rates-lookup.rates', format: 'embedded' },
      ]
    }
  })
  .withRelated('fields', [
    { type: 'computed-fields', id: 'todays-rates-lookup' },

    factory.addResource('fields', 'title').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),
    factory.addResource('fields', 'logo').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),
    factory.addResource('fields', 'assets').withAttributes({
      fieldType: '@cardstack/core-types::has-many',
      editorComponent: 'field-editors/dropdown-multi-select-editor'
    }).withRelated('related-types', [{ type: 'content-types', id: 'assets' }]),
    factory.addResource('fields', 'user').withAttributes({
      fieldType: '@cardstack/core-types::belongs-to',
    }).withRelated('related-types', [{ type: 'content-types', id: 'portfolio-users' }]),
    factory.addResource('computed-fields', 'total-assets-balance').withAttributes({
      computedFieldType: 'portfolio-wallet::balance-sums',
    })
  ]);

  factory.addResource('grants', 'wallet-self-grant')
    .withRelated('who', [{ type: 'fields', id: 'user' }])
    .withRelated('types', [
      { type: 'content-types', id: 'wallets' },
    ])
    .withAttributes({
      'may-read-resource': true,
      'may-read-fields': true,
      'may-create-resource': true,
      'may-update-resource': true,
      'may-delete-resource': true,
      'may-write-fields': true,
    });

let models = factory.getModels();
module.exports = function() { return models; };

```

#### Relationships to an already existing property

When a new `factory.addResource(type, id)` statement is used, the resource is added to the schema of the card. If a resource already exists in the schema, the user can relate to it using `{type: resource-type, id: resource-id}`. For example, in the above code, `wallets` is related to `todays-rates-lookup`, which is an already created resource. Thus, the syntax for adding this relationship is 
```js
.withRelated('fields', [
    { type: 'computed-fields', id: 'todays-rates-lookup' },
```
