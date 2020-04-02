In this section of the Guides, you will learn how to add a content editing mode to any Card in your project, also known as the Right Edge.

Most websites need a way for users to create new content or modify it. For example, a bank customer updates their contact information, a restaurant owner adds more menu items, and a case manager changes the status of a request.
To handle this, most traditional web apps are littered with forms that are custom-built and individually maintained.

Instead, Cardstack developers set some minimal configuration and get instant content editing tools in the browser. For example, the right hand toolbar in the screenshot below is auto-generated from a Card's schema:

![An editor panel on the right edge, with field inputs](/images/card-sdk/right-edge-example.jpg)

It is a WYSIWYG (what you see is what you get) experience where a user makes changes to the Card's content and sees immediately what the result would look like.

## Enabling the Edges

To start using the right edge, first make sure that you have the following in your project's `application.hbs`:

```handlebars
{{#cardstack-edges}}
  {{#squishable-container}}
    {{outlet}}
  {{/squishable-container}}
{{/cardstack-edges}}
```

For someone to see the editing panel, they must be logged in, and have a valid user session and the correct grants that allow them to edit content. While you are developing, you can add a fake superuser login by adding the following to your `application.hbs`, just inside of the `squishable-container`:

```handlebars
  {{#mock-login as |login|}}
    <Cta @handleClick={{action login}} @label='Edit Content'/>
  {{/mock-login}}
```

### Learn more

- Read about authorization, authentication, and mock users for testing in [Grants](../../data/grants/)
- Explore the customization options and features of [`squishable-container`](https://github.com/cardstack/squishable-container)

## Built-in field editors

Field editors are components that handle user input.
Cardstack provides some built-in content editor components.

When a field is set to certain `core-types` in a Card's schema, some editors get automatically applied:

- Boolean: `field-editors/boolean-editor` is automatically provided for `@cardstack/core-types::boolean`
- Date: `field-editors/date-editor` is automatically provided for `@cardstack/core-types::date`
- Integer: `field-editors/integer-editor` is automatically provided for `@cardstack/core-types::integer`
- String: `field-editors/string-editor` is automatically provided for `@cardstack/core-types::string`

Other built-in editors should be set for each field in the Card's schema [cardstack.com](https://cardstack.com): 

- Datetime: use `field-editors/datetime-editor`
- Dropdown: use 
    - `field-editors/dropdown-choices-editor`
    - `field-editors/dropdown-multi-select-editor`
    - `field-editors/dropdown-search-editor`
    - `field-editors/dropdown-search-multi-select-editor`

For example, this dropdown menu lets someone assign a `category` grouping to a photo Card:

```js
    factory.addResource('fields', 'category').withAttributes({
      fieldType: '@cardstack/core-types::belongs-to',
      editorOptions: { displayFieldName: 'name' },
      editorComponent: 'field-editors/dropdown-choices-editor'
})
```

## Passing options to a field editor

Field editors can take options using the `editorOptions` property in a Card's schema for a specific field. In this example, a property named `style` with the value `switch` will get passed to the `field-editors/boolean-editor` component.

```js
factory.addResource('fields', 'is-admin-user').withAttributes({
  fieldType: '@cardstack/core-types::boolean',
  editorOptions: { style: 'switch' }
})
```

To see which options are available for each of the built-in field editors, see the [core types documentation](https://github.com/cardstack/cardstack/tree/v0.14.49/packages/core-types).

## Creating your own field editor component

Imagine that you want the editing field to have some input validation behavior, or it is more complex than the built-in editors.
You can create your own field editor components for a Card.

From within the directory for a Card, run:

```bash
ember generate component field-editors/my-editor-name.
```

This will generate four files:

- a Template at `card-name/addon/templates/components/field-editors/my-editor-name.hbs` which handles display
- a JavaScript file at `card-name/addon/components/field-editors/my-editor-name.js`, where you can add interaction and logic
- a second JavaScript file at `card-name/app/components/field-editors/my-editor-name.js` with some boilerplate that reexports the component, which you will not need to edit unless you decide to change the name of your editor.
- A test that you can choose to fill in or delete

In your Card's schema, specify which field should use your custom editor:

```js
factory.addResource('fields', 'my-field-name').withAttributes({
    fieldType: '@cardstack/core-types::string',
    editorComponent: 'field-editors/my-editor-name'
    editorOptions: { someSetting: true }
})
```

A field editor is a regular Ember Component which receives the Card's `content` and the `field` that the editor should be used for, plus any `editorOptions` from the schema. 

For example, let's say that we want to make an editor that is an `input` but transforms every word to upper case. In this template below, we use some Ember features to make changes to the input data. We will bind the `value` of the `input` to our field by using the `get` helper.

```handlebars
<div class="field-editor-my-editor-name">
  <input
    type="text"
    value={{get content field}}
    oninput={{action "upper_case" value="target.value"}}
  >
</div>
```

Since field editors are Ember Components, we define the `upper_case` function in its respective `component` file. Note that `my-editor-name` in the above code should be replaced by the path of the respective `template` file, and it should be changed to a relative path:

```js
import Component from '@ember/component';
import layout from '../../templates/components/field-editors/my-editor-name';
export default Component.extend({
    layout,
    actions: {
        upper_case(value) {
            let content = this.get('content');
            let field = this.get('field');
            content.set(field, value.toUpperCase());
        }
    }
});
```

## Learn more

To see more examples of custom field editors, check out the [editor JavaScript files](https://github.com/cardstack/cardboard/tree/v0.14.49/cards/article/addon/components/field-editors) and [Templates](https://github.com/cardstack/cardboard/tree/v0.14.49/cards/article/addon/templates/field-editors) in the Cardboard demo app.
These field editors are used in the [schema](https://github.com/cardstack/cardboard/blob/v0.14.49/cards/article/cardstack/static-model.js) of the article Card.
