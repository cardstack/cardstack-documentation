Templates are where a developer writes HTML markup and more to display data and organize content.

Each Card has two main templates, `isolated.hbs` and `embedded.hbs`.
In this section, we'll cover where those files live, what they look like, and how to display a Card's data in them.

## Creating Templates

Templates are found in the `addon/templates` directory within a Card.
Each template has a corresponding JavaScript file in `addon/components`,
and the export of those JavaScript files in `app/components/cardstack`.

Template files end in `hbs`, and they contain regular HTML markup,
references to the Card's data,
and regular Ember [Components](https://guides.emberjs.com/release/components/defining-a-component/) and [Template helpers](https://guides.emberjs.com/release/templates/handlebars-basics/).

### Example template

For example, let's say that we have created a Card called `photographs` with `ember generate card photograph`, and added some `field`s for `title`, `location`, and `description` in the `static-model.js`, and made some seed data with an id of `1`.

Here's how that data could be referenced in `addon/templates/isolated.hbs`:

```handlebars
<h1>{{content.title}}<h1>
<p>This photo was taken at {{content.location}}.</p>
<p>{{content.description}}</p>
```

If you wanted to see this template in action, first make sure you have the environment running:

```bash
yarn start-prereqs
yarn start
```

Then visit `localhost:4200/photographs/1` to see your Card!

## Isolated vs. Embedded Templates

What is the difference between an isolated and an embedded template?

An isolated template is used when someone is viewing the Card as a stand-alone page. An embedded template shows what the Card should
look like when it's included in a different view with other Cards.

For example, in the Cardboard demo app, when you are looking at the list of many articles, you are seeing each Card in its embedded layout:

![screenshot showing many articles](/images/cardboard-initial.png)

Once you click on an individual article, it brings you to a view that uses the isolated layout:

![screenshot showing one article](/images/isolated-template.jpg)

## Why two layouts?

Have you ever used an app or software where you had to do a training just to learn how to use it? Without strong visual cues, it is hard to navigate through new interfaces.

By creating both an embedded and isolated view for your Card,
you can deliver a better experience.
The embedded template is a mini preview of what someone will see when
they follow the Card to its isolated view.

When another developer uses your Card in their own project, they have a preview ready that can be used in almost any layout.

## Displaying data

The isolated and embedded templates automatically receive Card data as `content`. To see what data is loaded, you can use the [Ember Inspector's Data tab](https://guides.emberjs.com/release/ember-inspector/data/).

## Template Syntax

If you are not already familiar with Ember Template syntax, here are some links and examples to get you started.

### Content

When you reference `content` data for the card, wrap it in double curly braces.

```handlebars
{{content.title}}
```

### Conditionals

The [`if`](https://guides.emberjs.com/release/templates/conditionals/) helper lets you add conditional logic to a template:

```handlebars
{{#if content.isGuestPhotographer}}
    This article is by our guest, {{content.name}}!
{{/if}}
```

### Iterating over an array

If an attribute of your content is an array, iterate over it using an [`each`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each?anchor=each) helper:

```handlebars

{{#each content.topics as |topicTag|}}
    <span class="topic-tag">{{topicTag}}</span>
{{/each}}
```

### Using a component

[Ember Components](https://guides.emberjs.com/release/components/defining-a-component/) have two ways to be referenced in a template. They are equivalent. Components only have the data you pass into them.

```handlebars
<MyComponentName @title={{content.title}} />
or
{{MyComponentName @title=content.title}}
```

## Learn more

See [Cards at Rest, Cards in Motion](https://medium.com/cardstack/cards-at-rest-cards-in-motion-4a0f88a8b6c5) for more examples of isolated and embedded templates in action.

To get more practice with Template syntax, try out an [Ember Tutorial](https://guides.emberjs.com/release/tutorial/ember-cli/).
