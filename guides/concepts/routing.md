The idea is that a card can define a series of routes that it supports, and that the routes can cascade, such that if a card's router routes a path to a particular card, that card can then in turn route to another card. We use the term "routing-card" for a card that has a router. And specifically the top level routing card is called the "application card".

To support this capability, cards can specify a router in their `<card module folder>/cardstack/router.js` file. An example `router.js` looks like this:

```js
module.exports = function (routingCard) {
  return [{
    // Note that because this query does not use `:id` nor `:friendly_id`, we would never
    // use this route as a canonical path for a card in the API response.
    path: '/latest-article',
    query: {
      filter: {
        type: { exact: 'articles' }
      },
      sort: '-publish-date'
    }
  },{
    // This is an example of a using a "slug" or human friendly ID in the URL to identify a card
    // as opposed to the actual card's ID (which may not be easy for a human to remember or type).
    path: '/good-reads/:friendly-id',
    query: {
      filter: {
        type: { exact: 'articles' },
        slug: { exact: ':friendly_id' }
      }
    }
  },{
    // This is an example of using a query param in the path to make a routing decision.
    // Note that because this query does not use `:id` nor `:friendly_id`, we would never
    // use this route as a canonical path for a card in the API response.
    path: '/most-popular?since=:date',
    query: {
      filter: {
        type: { exact: 'articles' },
        'publish-date': {
          range: { gt: ':date' }
        }
      },
      sort: '-popularity'
    }
  },{
    // This is an example of a static mapping route, where the type and ID provided in the URL
    // map directly to the type and ID of the card to route to.
    path: '/:type/:id',
    query: {
      filter: {
        type: { exact: ':type' },
        id: { exact: ':id' }
      }
    }
  },{
    // This is an example of a vanity URL, where you have a URL that points to a particular card.
    // In this example we use the data of the "routing card" to fashion the URL, which happens
    // to be the routing card itself.
    path: '/',
    query: {
      filter: {
        type: { exact: routingCard.data.type },
        id: { exact: routingCard.data.id }
      }
    }
  }];
};
```

The router is leveraged when the client makes a request to get a `space`. A `space` is retrieved by URL. So if the client wants to enter the route `/latest-article`, it makes a request to the API: `GET https://<hub api domain>/api/spaces/%2Flatest-article`. The API then uses the router above to match the path to a particular route whose query will be used to find the card to display to the user. The router will match the path in the order that the routes appear in the router, so the first pattern that matches the path is the one that will be used in the case where potentially two routes match match a path.

## Application Cards
Each Cardstack application has an "application card" that is the top level routing card for the cardstack application. Any card can serve as the application card in the cardstack application. If no application card is specified, the hub uses a default, "Getting Started", application card. Additionally if the application card does not specify a router the hub will look for a `<cardstack applicaiton folder>/cardstack/route.js` file in the enclosing cardstack application. If no `cardstack/route.js` file exists in the enclosing cardstack application, then the hub provides a default router (`@cardstack/routing`) that includes a static mapping route and a vanity URL of "/" to the application card itself. Cardstack applications can specify their application cards in the `plugin-configs/@cardstack-hub` configuration.

```js
// <cardstack HR application folder>/cardstack/data-sources/default.js

factory.addResource('plugin-configs', '@cardstack/hub')
  .withAttributes({
    'plugin-config': {
      'application-card': { type: '@acme-corp/applications', id: 'hr-application' }
    }
  })
  .withRelated('default-data-source', { data: { type: 'data-sources', id: 'default' } });
```

In order to specify the name of the router to use for the application card, the cardstack developer can specify an attribute on the application card's content-type `router`. This is set to the feature name of the feature whose router that you want to use. The feature name is the npm module name of the feature. So typically this means that we would specify the npm module name of the card in its content-type's router attribute if we want the card to have a router.

```js
// <@acme-corp/acme-application card module folder>/cardstack/static-model.js for a card that has npm module name of "@acme-corp/acme-application"
// the corresponding router would live in <card module folder>/cardstack/router.js within the same npm module

factory.addResource('content-types', 'acme-applications')
  .withAttributes({ router: '@acme-corp/acme-application' })
  .withRelated('fields', [
    factory.addResource('fields', 'application-name').withAttributes({
      fieldType: '@cardstack/core-types::string'
    })
  ]);

// open read grant allows everyone to see the application card when routed directly to it
factory.addResource('grants', 'acme-applications-grant')
  .withAttributes({
    'may-read-fields': true,
    'may-read-resource': true
  })
  .withRelated('who', [{ type: 'groups', id: 'everyone' }])
  .withRelated('types', [{ type: 'content-types', id: 'acme-applications' }]);
```

```js
// <cardstack HR application folder>/cardstack/static-models.js
// this is the application card that the plugin-configs/@cardstack/hub points to for the HR application

factory.addResource('acme-applications', 'hr-application')
  .withAttributes({ 'application-name': 'Acme HR System' });
```

## Error Cards
Additionally, when the router is unable to find a card for the provided path, it will return an error card. A system error card is provided. Cardstack application developers can provide their own custom error cards by creating a content-type that uses an `*-errors` suffix of the routing card's content type. So if the application card's content-type is `acme-applications`, a custom error card for this application card would be the content type of `acme-applications-errors`, and you should have at least one instance of this type with the ID of 'not-found' that is returned when the router cannot find a card for the path provided (this can be established in the `static-model` feature of your custom error card). You can then provide a custom template for this card as an ember addon in the same way a you provide for any card. You should also set a world read grant for this content type, so that errors are not inadvertently hidden for API clients.

When a routing card triggers an error because a card cannot be found for the path, the error will bubble up through all the routing cards that where involved with the routing of the path. The custom error card that is closest to the router that was unable to resolve the path will be the error card that is returned from the server.

```js
// <@acme-corp/acme-application card module folder>/cardstack/static-model.js for a card that has npm module name of "@acme-corp/acme-application"

factory.addResource('content-types', 'acme-applications-errors');

// open read grant allows everyone to see the error card
factory.addResource('grants', 'acme-applications-errors-grant')
  .withAttributes({
    'may-read-fields': true,
    'may-read-resource': true
  })
  .withRelated('who', [{ type: 'groups', id: 'everyone' }])
  .withRelated('types', [{ type: 'content-types', id: 'acme-applications-errors' }]);

// need to have a "not-found" instance of the error card
factory.addResource('acme-applications-errors', 'not-found');
```

## Canonical Paths for Cards
The mechamism responsible for generating json:api documents for cards, `DocumentContext`, works such that if `meta.routing-card`, `meta.routing-id` appears on the document presented to it, DocumentContext will add `links.self` to all the resources in the json:api document that it constructs. These are the canonical paths for the resources based on the specified routing card's router. The way that we derive a canonical path for a resource is to introspect the routing card's router and look for (in the following order):

1. A query that matches the specified resource specifically. This is a vanity URL to the resource, and has the highest precedence when deriving a canonical path to the resource.
2. A query that can match the specified resource using a `:friendly_id` in the router. The `:friendly_id` is a special replacement tag in the router that is the developer's signal to the hub that the field should be considered as a identifier for the content. This is what we have previously called the "routing field". This has the second highest precedence when deriving a canonical path to the resource.
3. A static mapping route, where the type and ID are specified as replacement tags in the path, and are used in the query to find a specific resource by type and ID.

The resulting `links.self` property is used by the ember client in order to transition to a particular card's canonical path. Note that it is possible for a router to be fashioned that results in not all cards being routable. In such cases, the `{{cardstack-url}}` helper and various tools that depend on getting the route for a card will be unable to operate for non-routable cards.

## Query Parameters
The `GET https://<hub api domain>/api/spaces/<path of card>` spaces json:api response has an attribute `query-params` that represents the query params declared in the route that matches the card path. These query params are then fed to the resulting card component with the `params` property. Card components can use the `params` property to access their query params. The query parameters in the actual card URL must be namedspaced with the content-type of the card that consumes the query parameter. For example in the route `/most-popular?since=:date` in the example router above, a URL that matches this route would look like:
```
https://<application domain>/most-popular?since=acme-applications[date]=2018-01-01&im-ignored-by-card=blah
```
Where `acme-applications` is the content-type of the routing card that the query param pertains to. The query parameter `im-ignored-by-card` is not specified in the router and as a result it is *not* passed to the resulting card. The `space` for this particular path would specify a `query-params` attribute of `"?since=2018-01-01"`, which would then be passed to the `articles` card's component as the object `{ since: '2018-01-01' }` in the `params` property of the `articles` card component (note that as a convenience we strip off the namespacing when passing the query params to the card components).

A convenience notation is also supported for declaring query parameters consumed by a particular card. If a route omits the `query` property, the router will return the routing card as primary card for the space. In such a manner, you can use the router of a card to simply declare the query parameters that a card can consume. Consider the example where the application card uses the following router:

```js
// <cardstack application folder>/cardstack/routes.js

module.exports = function() {
  return [{
    path: '/:type/:id',
    query: {
      filter: {
        type: { exact: ':type' },
        id: { exact: ':id' }
      }
    }
  }];
```

Then you additionally have a content-type `blogs` that uses a query parameter `since` to constrain the articles displayed in a blog instance to only the articles that has been published after the `since` query parameter. To allow the `since` query parameter to be passed to your `blogs` card component, you can add the following `cardstack/routes.js` to your `blogs` card npm module.

```js
// <@acme-corp/acme-blog card module folder>/cardstack/routes.js for the `blogs` content-type that the application consumes.

module.exports = function() {
  return [{
    path: '?since=:since'
  }];
```

In this example, the URL for the blog, which includes the name-spaced query parameter, looks like this:

```
https://<application domain>/blogs/chris?blogs[since]=2018-01-01
```

Note that the namespace for the query parameter `since` is `blogs` since the `blogs` content-type's router is the router that declares the query param in the `{ path: '?since=:since' }` route above.