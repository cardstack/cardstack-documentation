I have implied that there are various types of files that a Cardstack plugin can define. Thankfully there are some hints as to what types/files that you can provide which is saved as data in the `@cardstack/hub` package. There is a file named `bootstrap-shema.js` that lists some of the `content-types` that you can provide from your Cardstack plugin. You will see things like fields, computed-fields, constraints etc. I'm not exactly sure how to get from this list to the name of the files so potentially there should be a canonical documentation somewhere... You will also see the full list of plugins that have loaded when you run the cardstack/deck project:

```sh
cardstack/plugin-loader starting from path /Users/mansona/git/cardstack/deck/test-harness
cardstack/plugin-loader === found installed plugins===
test-harness            static-models        test-harness
@cardstack/ephemeral    writers              @cardstack/ephemeral
@cardstack/ephemeral    indexers             @cardstack/ephemeral
...
@cardstack/core-types   constraint-types     @cardstack/core-types::greater-than
@cardstack/core-types   constraint-types     @cardstack/core-types::max-length
...
@cardstack/handlebars   field-types          @cardstack/handlebars
@cardstack/pgsearch     searchers            @cardstack/pgsearch
...
@cardstack/jsonapi      middleware           @cardstack/jsonapi
@cardstack/mobiledoc    field-types          @cardstack/mobiledoc
@cardstack/mobiledoc    computed-field-types @cardstack/mobiledoc::read-time
@cardstack/models       code-generators      @cardstack/models
...
@cardstack/tools
```

Some of these Cardstack plugins don't list the content-type (like `@cardstack/tools`) which can mean that they are just Ember Addons that are being loaded to provide components like field-editors.

You can see examples of field-types, computed-field-types, and constraint-types being defined in the @cardstack/core-types package located in cardstack/cardstack/packages/core-types/cardstack. In this case when you are referencing the field types (or any other content-type) elsewhere you use the name of the package combined with the name of the file for that specific type

```javascript
    factory.addResource('fields', 'quote-text').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),
```

In this case the file it is referring to is `cardstack/cardstack/packages/core-types/cardstack/field-types/string.js`.  You can also provide a fieldType that is the same name as the package (without the ::file-name suffix) by naming it just `field-type` in the top level of the cardstack plugin. For example, the field type for `@cardstack/mobliedoc` is located at `cardstack/cardstack/packages/mobiledoc/cardstack/field-type.js`.
