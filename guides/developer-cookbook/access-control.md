How do you restrict who can see a Card's data?
In this tutorial, you will learn how to use groups, grants, and authentication to limit the read, write, edit, and deletion of Cards and their fields.

Let's imagine we are building an app for a photography contest.
We want to allow certain users, our "reviewers," to log in and edit a secret "comment" field on the photos.
The general public should be able to see the photos, but not the comment.

Over the course of this tutorial, we will create the following:

- log out button
- `photo` Card
- Grants and permissions

## Prerequisites

Before you get started, you should read through [Grants](../../grants/), and you should have done some of the other tutorials like [the quick start](../../getting-started/) and [Movie List](../movielist-tutorial/)

You will also need a free account on [GitHub](https://github.com) in order to complete the Bonus section.

## Create the project files

The best way to try this tutorial is to start from a copy of the [`project-template`](https://github.com/cardstack/project-template):

```sh
git clone https://github.com/cardstack/project-template.git
cd project-template
yarn install
```

## Install dependencies

If you started this tutorial using the [`project-template`](https://github.com/cardstack/project-template), you can skip this step.

`cardhost` requires the following packages to be installed in its `package.json`:

- `@cardstack/github-auth`
- `@cardstack/git`
- `@cardstack/mock-auth`
- `@cardstack/authentication`

Make sure to replace the `<x.y.z>` in the example below with the version of Cardstack you are using.
With few exceptions, a Cardstack project's dependencies should all have matching versions.
You can install dependencies like this:

```sh
cd cardhost
yarn install @cardstack/package-name@<x.y.z> --exact
```

You can find the source code for these packages on [GitHub](https://github.com/cardstack/cardstack/tree/master/packages).

## Create the photo Card

Now that setup is done, we will create a photo Card:

```sh
cd cardhost
ember generate card photo
```

Add an entry for each card into the `package.json` of `cardhost`, as `devDependencies`:

```json
"cardhost-photo": "*"
```

Then, run `yarn install` to link the photo Card.

## Create fields for the photo card

In `cards/photo/cardstack/static-model.js`, we will add some fields to the card,
`photo-title`, `image-url`, `alt-text`, and `comment`:

```javascript
const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');

let factory = new JSONAPIFactory();

factory.addResource('content-types', 'photos')
  .withRelated('fields', [
    factory.addResource('fields', 'photo-title').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),
    factory.addResource('fields', 'photographer').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),
    factory.addResource('fields', 'image-url').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),
    factory.addResource('fields', 'alt-text').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),
    factory.addResource('fields', 'comment').withAttributes({
      fieldType: '@cardstack/core-types::string'
    })
  ]);

let models = factory.getModels();
module.exports = function() { return models; };
```

To make testing easier, let's also create some seed data.
In `cardhost/cardstack/seeds/data.js`, create at least one photo card:

```javascript
  factory.addResource('photos', 1).withAttributes({
    'photo-title': 'Dashboard heading',
    'photographer': 'John Lee',
    'image-url': './images/moraine-lake-john-lee.jpg',
    'alt-text': 'a serene lake in the summer surrounded by trees and mountains',
    'comment': 'This should be a frontrunner'
  });
```

In this example, we've downloaded a free photo by [John Lee](https://unsplash.com/photos/oMneOBYhJxY) on [Unsplash](https://unsplash.com/), named it `moraine-lake-john-lee.jpg`, and placed it in `cardhost/public/images`
For a challenge, you could use the
[`@cardstack/image`](https://github.com/cardstack/cardstack/tree/master/packages/image) and
[`@cardstack/s3`](https://github.com/cardstack/cardstack/tree/master/packages/s3) plugins instead of 
placing the photo directly in `public`.
However for this tutorial, we will keep it as simple as possible.

## Create a photo template

In the photo's isolated template, `cards/photo/addon/templates/isolated.hbs`, let's add some markup and use the fields from the Card's schema:

```handlebars
<div class="photo-isolated">
  <h1 data-test-photo-isolated-title>{{content.photoTitle}}</h1>
  {{#cs-field content "imageUrl" as |image|}}
    <img class="img-photo" src={{image}} alt={{content.altText}}>
  {{/cs-field}}
  <p>Photographer: {{content.photographer}}</p>
  <p>{{content.comment}}</p>
</div>
```

`{{cs-field}}` is needed here because we are using two card properties on the same HTML element.
Note that a dasherized field like `alt-text` becomes `altText` in camelcase, whenever we use it in a template.

You might also be wondering what "alt text" is in the first place.
Every image on the web should have an `alt`, which stands for [alternative text](https://webaim.org/techniques/alttext/).
This text is critical for accessibility.
For example, if someone uses a screen reader to browse your app, the software will announce the `alt` for an image.

We should also add some styling so that the image isn't too large. In `cards/photo/addon/styles/photo-isolated.css`, add the following below the existing styles:

```css
.photo-isolated img {
  width: 100%;
}
```

## Try it out

If you have not done so already, now is a good time to make sure everything is working so far.
Make sure you have Docker running, and in the console, run:

```sh
yarn start-prereqs
yarn start
```

If you visit `http://localhost:4200/photos/1`, you should be able to see your seed data in use:

![](/images/access-control-tutorial/isolated-template.png)

As you make changes to the schema of a Card, you will need to restart the server many times.
Here is a tip to cut down on rebuild times.
You can do `yarn start-hub` in one window of your console,
wait for it to finish starting, then `yarn start-ember` in another window.
After that, you can restart just the `hub`.

## Add log in and Log out buttons

Next, we will add buttons to log in and log out.
If you have done other Card SDK tutorials to enable the right edge, the next steps should be familiar.

In `cardhost/app/templates/application.hbs`, use the `LoginButton` component, which was included in the project template:

```handlebars
{{#cardstack-edges}}
  {{#squishable-container}}
    <LoginButton />
    {{outlet}}
  {{/squishable-container}}
{{/cardstack-edges}}
```

We will make one change to the login button component template. Let's add a "log out" option.
Replace the contents of `cardhost/app/templates/components/login-button.hbs` with the following:

```handlebars
{{#if (is-component "cardstack-session")}}
  {{#cardstack-session as |session|}}
    {{#if useGithubAuth}}
      {{#github-login as |login|}}
        {{yield session login}}
      {{/github-login}}
    {{else if session.isAuthenticated}}
      <button
        class="btn-edit"
        id="logout-button"
        onclick={{action session.logout}}
      >
        Log out
      </button>
    {{else}}
      {{#mock-login as |login|}}
        <button class='btn-edit' {{action login}}>
          Edit Content
        </button>
      {{/mock-login}}
    {{/if}}
  {{/cardstack-session}}
{{/if}}
```

What this says is, if we are using GitHub for authentication, use the GitHub Login component.
We will get to that later in the tutorial.
For now, it will check to see if the user is already authenticated, and show the "Log out" button if they are.
Clicking "log out" will use the `session.logout` action that is part of the build-in Card SDK.
Unauthenticated users will see the `mock-login` button instead.
Mock login is used for local development only, and we will do most of our work and testing with this "fake" user and authentication.

## 

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
