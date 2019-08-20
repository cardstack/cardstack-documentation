_This page is a work-in-progress! To help with content, click on the pencil icon in the top right corner._

Let's build an admin dashboard for editing Cards!
By the end, you will have content that you and your collaborators can edit online.
We'll use the [`@cardstack/github-auth`](https://github.com/cardstack/cardstack/tree/master/packages/github-auth) plugin for authentication, and configure grants and roles for the Card.

In this example, we'll imagine that we are adding scores to entries in a photography contest. All visitors to the site should be able to see the scores, but only admins should be able to create and view comments.

## Background knowledge

Before you get started, you should read through [Grants](../../grants/), and you should have created a Card that can be edited locally using the Right Edge and `mock-auth`.
You will also need a free account on [GitHub](https://github.com).

## Create the project files

The best way to try this tutorial is to start from a copy of the [`project-template`](https://github.com/cardstack/project-template)

## Install `github-auth`

If you started this tutorial using the [`project-template`](https://github.com/cardstack/project-template), you already have the `@cardstack/github-auth` and `@cardstack/git` plugins installed, and you can skip this step.

If needed, you can install these packages in the `cardhost`.
Make sure to replace the `<x.y.z>` in the example below with the version of Cardstack you are using.
With few exceptions, a Cardstack project's dependencies should all have matching versions.

```sh
cd cardhost
yarn install @cardstack/github-auth@<x.y.z> --exact
```

You can find the source code for these packages on [GitHub](https://github.com/cardstack/cardstack/tree/master/packages).

## Create some Cards

Now that setup is doen, we will create three Cards, `photo`, `scorecard` and `dashboard`:

```sh
cd cardhost
ember generate card photo
ember generate card scorecard
ember generate card dashboard
```

Add an entry for each card into the `package.json` of `cardhost`, as `devDependencies`:

```json
"cardhost-dashboard": "*",
"cardhost-photo": "*",
"cardhost-scorecard": "*",
```

Then, run `yarn install` to link them together.

## Set up fields and relationships

Next, give each Card some fields and relationships.

A dashboard should show both ratings and photos. Each photo should have some scorecards.
Each scorecard belongs to one photo.
We can represent these relationships using the `has-many` and `belongs-to` types in the Card SDK.

Let's start with the dashboard:

```javascript
// cards/dashboard/cardstack/static-model.js

const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');

let factory = new JSONAPIFactory();
factory.addResource('content-types', 'dashboards')
  .withAttributes({
    defaultIncludes: ['scorecards', 'photos'],
    fieldsets: {
      isolated: [
        {field: 'photos', format: 'embedded'},
        {field: 'scorecards', format: 'embedded'}
      ]
    }
  })
  .withRelated('fields', [
    factory.addResource('fields', 'heading').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),

    factory.addResource('fields', 'photos').withAttributes({
      fieldType: '@cardstack/core-types::has-many',
      editorComponent: 'field-editors/dropdown-search-multi-select-editor',
    })
    .withRelated('related-types', [{ type: 'content-types', id: 'photos' }]),

    factory.addResource('fields', 'scorecards').withAttributes({
      fieldType: '@cardstack/core-types::has-many',
      editorComponent: 'field-editors/dropdown-search-multi-select-editor',
    })
    .withRelated('related-types', [{ type: 'content-types', id: 'scorecards' }]),
  ]);

let models = factory.getModels();
module.exports = function() { return models; };
```

Next is the photo:

```javascript
// cards/photo/cardstack/static-model.js

const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');

let factory = new JSONAPIFactory();
factory.addResource('content-types', 'photos')
  .withAttributes({
    defaultIncludes: ['scorecards'],
    fieldsets: {
      isolated: [
        {field: 'scorecards', format: 'embedded'}
      ]
    }
  })
  .withRelated('fields', [
    factory.addResource('fields', 'title').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),

    factory.addResource('fields', 'description').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),

    factory.addResource('fields', 'url').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),

    factory.addResource('fields', 'scorecards').withAttributes({
      fieldType: '@cardstack/core-types::has-many',
      editorComponent: 'field-editors/dropdown-search-multi-select-editor',
    })
    .withRelated('related-types', [{ type: 'content-types', id: 'scorecards' }]),
  ]);

let models = factory.getModels();
module.exports = function() { return models; };
```

And lastly, the scorecard:

```javascript
// cards/scorecard/cardstack/static-model.js

const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');

let factory = new JSONAPIFactory();
factory.addResource('content-types', 'scorecards')
  .withAttributes({
    defaultIncludes: ['photos'],
    fieldsets: {
      isolated: [
        {field: 'photos', format: 'embedded'}
      ]
    }
  })
  .withRelated('fields', [
    factory.addResource('fields', 'score').withAttributes({
      fieldType: '@cardstack/core-types::number'
    }),

    factory.addResource('fields', 'comment').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),

    factory.addResource('fields', 'photo').withAttributes({
      fieldType: '@cardstack/core-types::belongs-to',
      editorComponent: 'field-editors/dropdown-search-multi-select-editor',
    })
    .withRelated('related-types', [{ type: 'content-types', id: 'photos' }]),
  ]);

let models = factory.getModels();
module.exports = function() { return models; };
```

## Check for mistakes

At this point, you should try running your project to check for any mistakes setting up the Cards and their schema.
Make sure you have Docker running. You will not see anything in the browser yet except the Welcome message, because we did not set up templates, grants, or login.

However, starting up the project will help you narrow in on any typos or steps you may have missed.

```sh
yarn start-prereqs
yarn start
```

Once you can see that your servers start up successfully, you can shut them down with `Control-C` and move on to the next step.

## Adding read permissions

- everyone group
- screenshot

## Adding write permissions

- admins group

## Creating login buttons

Now that we have added permissions for viewing, creating, and editing Cards, we need to create a way to log in.
The Card SDK comes with some built-in components that you can use!
We have two goals - at first, while we are working, we want to be able to edit anything locally.
Then, later on, we want to require login.
If someone is able to edit a GitHub repository that holds the data, they will be able to log in and make changes.

First, let's create a component that will hold our login buttons.

```sh
cd cardhost
ember generate component login-button
```

Copy and paste this code into the newly created `login-button.hbs`.
`mock-login` will provide us with a temporary superuser who can change anything.
`github-login` and `cardstack-session` give us a way to _actually_ log in.

```handlebars
{{#if (is-component "cardstack-session")}}
  {{#cardstack-session as |session|}}
    {{#if useGithubAuth}}
      {{#github-login as |login|}}
        {{yield session login}}
      {{/github-login}}
    {{else}}
      {{#mock-login as |login|}}
        {{yield session login}}
      {{/mock-login}}
    {{/if}}
  {{/cardstack-session}}
{{/if}}
```

In `login-button.js`, replace the generated code with this:

```javascript
import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({
  tagName: '',
  useGithubAuth: computed(function() {
    let githubAuthEnv;
    try {
      githubAuthEnv = window.require('@cardstack/github-auth/environment');
    } catch (e) {
      // dont assume github datasource is present
      return false;
    }
    return Boolean(get(githubAuthEnv, 'clientId'));
  })
});
```

Next, add the login button to `cardhost/app-templates`:

```handlebars
{{#cardstack-edges}}
  {{#squishable-container}}
    <LoginButton  />
    {{outlet}}
  {{/squishable-container}}
{{/cardstack-edges}}
```

## Create templates

For each Card, add some of the fields from `static-model.js` to its `isolated.hbs` and `embedded.hbs`,
such as `score` and `comment` for the scorecard.
Once you have added some field, you should be able to create Cards and edit them using the Right Edge.
At this point, we are still relying on the `mock-login` superuser, but in the next steps, we will
use login from `github-auth`.

Before moving on to the next step, try making at least one of each type of Card using the Right Edge.

If you are not sure what to do, we recommend that you check out some of our other tutorials to get up to speed.
Alternately, you can view the finished tutorial code here to get some ideas!

<!-- TODO add a link to the source code! -->

## Connect the plugin to GitHub

- authorizing users
- local env management
- deployed env management
- safe key handling
- screenshots

## Trying it out

- screenshots

## Creating an admin dashboard

- a Card that looks like the board, but is only visible to admins
