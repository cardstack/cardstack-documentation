How do you restrict who can see a Card's data?
In this tutorial, you will learn how to Card SDK features like groups, grants, and permissions.
You can control read, write, edit, and deletion of Cards and their fields, without writing server-side validation checks and endpoints yourself.

## What you will learn

Let's imagine we are building an app for a photography contest.
We want to allow certain users, our "reviewers," to log in and edit a secret "comment" field on the photos.
The general public should be able to see the photos, but not the comment.

Over the course of this tutorial, we will create the following:

- log in and log out buttons
- a `photo` Card that has some secret data
- Grants, groups, and permissions for anonymous and logged-in users

## Prerequisites

Before you get started, you should read through [Grants](../../grants/), and you should have done some of the other tutorials like [the quick start](../../getting-started/) and [Movie List](../movielist-tutorial/).
If you have already made a Card that you want to add permissions to, you can skip to [Add log in and log out buttons](./#Add-log-in-and-log-out-buttons)

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
Note that a dasherized field like `alt-text` becomes `altText` in camelCase, whenever we use it in a template.

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

## Add log in and log out buttons

Now that we have added permissions for viewing, creating, and editing Cards, we need to create a way to log in.
The Card SDK comes with some built-in components that you can use!
We have two goals - at first, while we are working, we want to be able to edit anything locally using a fake user.
Then, later on, we want to require real login.
If you have done other Card SDK tutorials to enable the right edge, the next steps should be familiar.

First, let's create a component that will hold our login buttons:

```sh
cd cardhost
ember generate component login-button
```

In the newly generated `login-button.js`, replace the code with this:

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
      return false;
    }
    return Boolean(get(githubAuthEnv, 'clientId'));
  })
});
```

Copy and paste this code into the newly created `login-button.hbs`:

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
We will get to that later in the tutorial, when we add real login.
Otherwise, it will check to see if the user is already authenticated, and show the "Log out" button if they are.
Clicking "log out" will use the `session.logout` action that is part of the build-in Card SDK.
Unauthenticated users will see the `mock-login` button instead.
Mock login is used for local development only, and we will do most of our work and testing with this "fake" user and authentication. Both mock login and session are built-in features of the Card SDK.

In `cardhost/app/templates/application.hbs`, use the `login-button` component:

```handlebars
{{#cardstack-edges}}
  {{#squishable-container}}
    {{login-button}}
    {{outlet}}
  {{/squishable-container}}
{{/cardstack-edges}}
```

## Understanding grants

Now we are at the point where we can talk about users, groups, and grants.

From a user experience perspective, we want anonymous users to be able to view all of the fields of a photo Card, except for `comment`. We want certain users, the commenters, to be able to log in, view the `comment`, and edit it.

From a technical perspective, that means we need a group for anonymous users and a group for our users who are allowed to add a comment.
Then for each of those groups, we need to state specifically which Cards and their fields they can access, a.k.a the grants.
Then, for each Card or field on a Card, we need to say what kind of operations are available: create, read, update, and destroy.

Some of this functionality is already provided in the project template. Have a look at `cardhost/cardstack/static-model.js`. There is a lot of code dedicated to setup, but you can focus on the `customGrantsAndGroups` function, which should look something like this:

```javascript
const customGrantsAndGroups = function(factory, cardSchemas) {

  // With this grant, anonymous users can see all Cards in the project.
  // Remove this line when you want to do card-by-card permissions instead.
  everyoneCanReadAllCards(factory, cardSchemas);

  // Your own groups and grants go here. Here are basics to get you started.
  // You can reference them in any Card in your project.

  factory.addResource("groups", "github-readers").withAttributes({
    "search-query": {
      filter: {
        type: { exact: "github-users" },
        permissions: { exact: "cardstack/project-template-data:read" }
      }
    }
  });

  factory.addResource("groups", "github-writers").withAttributes({
    "search-query": {
      filter: {
        type: { exact: "github-users" },
        permissions: { exact: "cardstack/project-template-data:write" }
      }
    }
  });

  factory.addResource("grants")
    .withRelated("who", [{ type: "groups", id: "github-readers" }])
    .withAttributes({
      mayLogin: true
    });

  factory.addResource("grants")
    .withRelated("who", [{ type: "fields", id: "id" }])
    .withRelated("types", [{ type: "content-types", id: "github-users" }])
    .withAttributes({
      "may-read-resource": true,
      "may-read-fields": true
    });
};
```

Let's go through what we see here:
- There is a function that makes all Cards readable by the `everyone` group. `everyone` is a special group that is built into the Card SDK. All users belong to this group, even anonymous users.
- Two groups are created, `github-readers` and `github-writers`
- Two grants are created with some permissions attached to them

This file is a good place to put `groups` and `grants` that will be used in multiple Cards,
you can add grants and groups in an individual Card's `static-model.js` too.

It's important to know that grants are additive. If we say in one place that `everyone` can see all cards, and elsewhere that admins can see a special card called "secrets," the `everyone` rule is still in effect and anonymous users will be able to see the secrets!
Likewise, if we have a rule that everyone can see the `photo` Card, and then later we write another grant saying that the `title` is visible to everyone, all the other fields will still be visible too.

## Writing our own grants

Since we already have these default grants and groups, what do we still need to do? Well, we don't want our whole Card to be readable by `everyone`, so we'll have to remove `everyoneCanReadAllCards`. If we do that, then we need to explicitly state which Cards and fields should be visible to everyone.  We also need to make it so that our commenters can see and edit the comment field for a photo.

We'll do this in stages so that it's easier to see how different grants affect what is visible.
Before you make any changes, restart your server, make sure everything so far is working, and commit your work.
At this point, you should able to view a photo Card and log in/out, but you should not yet be able to edit or create a photo Card.

First, let's take away the grants that let everyone see everything. Comment out or remove this line:

```javascript
// everyoneCanReadAllCards(factory, cardSchemas);
```

Now if you restart your server and visit `http://localhost:4200/photos/1`, you should not be able to view any content.

Let's write our own grant to allow everyone to view the photo Card. In `cards/photo/cardstack/static-model.js`, add the following below where we created the fields:

```javascript
  factory.addResource('grants', 'photo-world-read')
    .withRelated('who', [{ type: 'groups', id: 'everyone' }])
    .withRelated('types', [
      { type: 'content-types', id: 'photos' }
    ])
    .withAttributes({
      'may-read-resource': true,
      'may-read-fields': true,
    });
```

Now, restart the server. You should be able to see `http://localhost:4200/photos/1` again. In this grant we are saying that everyone can read the whole photo Card.

Next let's hide that comment field from anonymous users. Whenever you add some permissions for a Card, you have the choice to apply them to the whole Card or to specific fields. Replace the grant above with some field-specific control:

```javascript
  factory.addResource('grants', 'photo-resource-read')
    .withRelated('who', [{ type: 'groups', id: 'everyone' }])
    .withRelated('types', [
      {type: 'content-types', id: 'photos'},
    ])
    .withAttributes({
      'may-read-resource': true,
    });
  
  factory.addResource('grants', 'photo-field-read')
    .withRelated('who', [{ type: 'groups', id: 'everyone' }])
    .withRelated('fields', [
      {type: 'fields', id: 'photo-title'},
      {type: 'fields', id: 'photographer'},
      {type: 'fields', id: 'image-url'},
      {type: 'fields', id: 'alt-text'}
    ])
    .withAttributes({
      'may-read-fields': true,
    });
```

Here, we are saying that everyone has _some_ kind of read permissions related to type `photos`.
Then, below we describe which fields on the Card are viewable. Now, if you restart your server, you should be able to see the photo Card, but the `"This should be a frontrunner"` comment should be missing.

Next, we will add editing permissions for our logged-in users. Add this below the read permissions:

```javascript
  factory.addResource('grants', 'commenter-resource-update')
    .withRelated('who', [{ type: 'groups', id: 'github-writers' }])
    .withRelated('types', [
      {type: 'content-types', id: 'photos'},
    ])
    .withAttributes({
      'may-update-resource': true,
    });
  
  factory.addResource('grants', 'commenter-field-update')
    .withRelated('who', [{ type: 'groups', id: 'github-writers' }])
    .withRelated('fields', [
      {type: 'fields', id: 'comment'} 
    ])
    .withAttributes({
      'may-read-fields': true,
      'may-write-fields': true
    });
```

Here, we are saying that our commenters have _some_ kind of read permissions related to type `photos`, and then that they can both read and edit the `comment` field. We don't have to add any read permissions for the other fields, since  our commenter users automatically belong to the `everyone` group and receive those permissions too.

A commenter in this case is a user that belongs to the `github-writers` group.
We could name this grant something different than `commenter-field-update` if we wanted. It's just a label.
The real power of a grant is in making an association between a group of users and the permissions they have for the Card and its fields.

Now if you restart the server, you should be able to log in, open the Right Edge, and edit only the `comment` field.

### Alternative grants

It's helpful to see some variations on grants and try them out in order to understand how they work.
If we wanted the commenters to be more like admins who are able to view, create, edit, and delete the whole Card and all its field, we could have used something like this instead:

```javascript
factory.addResource('grants', 'photo-admin-update')
  .withRelated('who', [{ type: 'groups', id: 'github-writers' }])
  .withRelated('types', [
    { type: 'content-types', id: 'photos' }
  ])
  .withAttributes({
    'may-create-resource': true,
    'may-update-resource': true,
    'may-delete-resource': true,
    'may-write-fields': true
  });
```

Give it a try!

## Tips for debugging grants

Having trouble? Here's where to look.

- Is a field missing from the Right Edge that you should be able to edit? Make sure you are using that field in the template or it won't show up in the Right Edge.
- Look at the `static-model.js` for `cardhost` and each Card to check for overlapping grants.
If a grant in one file allows reading a certain Card type, no other grants can undo that.
- Make sure to restart your server when you make changes
- Clear your browser's cache. The login system utilizes cookies and local storage, and possibly something got left behind

## Bonus - extending the photo contest

With a fine-grained permissions system provided by the Card SDK, you can write grants and groups to suit almost any use case.
After this tutorial, there are many directions you could take!
For example:
- turn `comment` into its own Card type, and build a dashboard that shows all the comments by using Card relationships
- use the
[`@cardstack/github-auth`](https://github.com/cardstack/cardstack/tree/master/packages/github-auth)
package to add real login permissions.
- create many different groups with different tiers of editing ability
- write grants that only allow the creator to edit the record

## Learn more

You can read the [Grants guide](../../grants/) to learn about grants configuration in-depth.
Also check out the open source [Cardboard](https://github.com/cardstack/cardboard) project for examples of `@cardstack/github-auth` and more custom grants in action.
