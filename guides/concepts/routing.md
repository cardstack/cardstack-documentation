The idea is that a card can define a series of routes that it supports, and that the routes can cascade, such that if a card's router routes a path to a particular card, that card can then in turn route to another card. We use the term "routing-card" for a card that has a router. And specifically the top level routing card is called the "application card".

## Application Cards
Each Cardstack application has an "application card" that is the top level routing card for the cardstack application. Any card can serve as the application card in the cardstack application. If no application card is specified, the hub uses a default, "Getting Started", application card. Additionally if the application card does not specify a router the hub provides a default router (`@cardstack/routing/cardstack/default-router`) that includes a static mapping route and a vanity URL of "/" to the application card itself. Cardstack applications can specify their application cards in the `plugin-configs/@cardstack-hub` configuration. Note that the default application card leverages the default router.

Consider the following example for Acme Corp's HR application (Note that we use the term "Cardstack Application", when in fact a Cardstack application is really just another card. Consider "Cardstack Application" as the top level npm module in your project):

```js
// <cardstack HR application folder>/cardstack/data-sources/default.js

factory.addResource('plugin-configs', '@cardstack/hub')
  .withAttributes({
    'plugin-config': {
      // this is the application card for the the Acme Corp's HR application that contains the top level router
      'application-card': { type: '@acme-corp/applications', id: 'hr-application' }
    }
  })
  .withRelated('default-data-source', { data: { type: 'data-sources', id: 'default' } });
```

In order to specify the name of the router to use for the application card, the cardstack developer can specify an attribute on the application card's content-type `router`. This is set to an array of routes for the card.

```js
// <cardstack HR application folder>/cardstack/static-models.js

factory.addResource('content-types', 'acme-applications')
  .withAttributes({ router: [
    {
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
      // to be the routing card itself. The ":card:field-name" convention is used to refer to fields
      // on the routing card.
      path: '/',
      query: {
        filter: {
          type: { exact: ':card:type' },
          id: { exact: ':card:id' }
        }
      }
    },{
      // We can use `additionalParams` to pass additional properties to the card's component
      // that are unique to the route. In this case we want to render the same card as in '/'
      // but pass a parameter that will inform the card to scroll to the #section1 anchor in
      // the '/section-1' route. Note that you can include replacement tags in the `additionalParams`
      // properties.
      path: '/section-1',
      query: {
        filter: {
          type: { exact: ':card:type' },
          id: { exact: ':card:id' }
        }
      },
      additionalParams: {
        scrollTo: '#section1'
      }
    },{
      path: '/section-2',
      query: {
        filter: {
          type: { exact: ':card:type' },
          id: { exact: ':card:id' }
        }
      },
      additionalParams: {
        scrollTo: '#section2'
      }
    }
  ]});
factory.addResource('acme-applications', 'hr-application');

// open read grant allows everyone to see the application card's fields when routed directly to it
factory.addResource('grants', 'acme-applications-grant')
  .withAttributes({
    'may-read-fields': true,
    'may-read-resource': true
  })
  .withRelated('who', [{ type: 'groups', id: 'everyone' }])
  .withRelated('types', [{ type: 'content-types', id: 'acme-applications' }]);
```

## Routing

The router is leveraged when the client makes a request to get a `space`. A `space` is retrieved by URL. So if the client wants to enter the route `/latest-article`, it makes a request to the API: `GET https://<hub api domain>/api/spaces/%2Flatest-article`. The API then uses the router above to match the path to a particular route whose query will be used to find the card to display to the user.

In order to accomdate the ability to match paths to routes, on startup, the hub assembles a router map that represents all the possible routes in the system based on all the cards that have routes associated with them. The hub performs this by beginning at the application card, and recursively descending through all the possible cards that the application card routes to, and then descending through all those cards, and so on. As the hub discovers all the possible routes in the system it compiles these routes into the router map. The hub then arranges the routes in the router map such that the most specific routes are matched before the most general routes.

_TODO: Provide an illustration of the router map structure and how it relates to routing cards_

## Error Cards
Additionally, when the router is unable to find a card for the provided path, it will return an error card. A system error card is provided. Cardstack application developers can provide their own custom error cards by creating a content-type that uses an `*-errors` suffix of the routing card's content type. So if the application card's content-type is `acme-applications`, a custom error card for this application card would be the content type of `acme-applications-errors`, and you should have at least one instance of this type with the ID of `not-found` that is returned when the router cannot find a card for the path provided (this can be established in the `static-model.js` feature of your cardstack application). You can then provide a custom template for this card as an ember addon in the same way a you provide for any card. You should also set a world read grant for this content type, so that errors fields are not inadvertently hidden for API clients.

When a routing card triggers an error because a card cannot be found for the path, the error will bubble up through all the routing cards that where involved with the routing of the path. The custom error card that is closest to the router that was unable to resolve the path will be the error card that is returned from the server.

```js
// continued from <cardstack HR application folder>/cardstack/static-models.js above...

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
The mechamism responsible for generating json:api documents for cards, `DocumentContext`, works such that if `attributes.route-stack`, appears on the document presented to it, DocumentContext will add `links.self` to all the resources in the json:api document that it constructs (this is the case for the `spaces` content type). The route stack is an array of all the cards (as `type/id`) that the router routed through in order to reach a particular card. The `links.self` links are the canonical paths for the resources based on the `route-stack`. The way that we derive a canonical path for a resource is to introspect each routing card in the route stack, from the highest level routing card to the deepest level routing card and identify a route whose query will result in the card whose canonical path we are resolving (in the following order):

1. A query that matches the specified resource specifically. This is a vanity URL to the resource, and has the highest precedence when deriving a canonical path to the resource.
2. A query that can match the specified resource using a `:friendly_id` in the router. The `:friendly_id` is a special replacement tag in the router that is the developer's signal to the hub that the field should be considered as a identifier for the content. This is what we have previously called the "routing field". This has the second highest precedence when deriving a canonical path to the resource.
3. A query that can match the specified resource where the `type` field in the query is equal to the content type of the card, and the id field is derived from the path.
4. A static mapping route, where the type and ID are specified as replacement tags in the path, and are used in the query to find a specific resource by type and ID.

Note that the hub will take into account any `:card:field-name` replacement tags in the queries and use the cards in the route-stack to resolve these tags before performing the matching above.

The resulting `links.self` property is used by the ember client in order to transition to a particular card's canonical path. Note that it is possible for a router to be fashioned that results in not all cards being routable. In such cases, the `{{cardstack-url}}` helper and various tools that depend on getting the route for a card will be unable to operate for non-routable cards.

## Params

When the `spaces` document is rendered for a particular route, it will supply the component for the card that is being routed to a bucket of properties in a `params` field. This will include:
* any replacement tags we added in the route's path (e.g. dynamic segments)
* any query parameters that we specified in the routes path
* the path segment for the route
* `additionalParams` that have been defined for the route. `additionalParams` may include `:card:field-name` replacement tags if we wish to pass the routing card's data into the card we are routing to.

So for example, the following route, which is mounted on the `acme-applications` application card content-type, whose application card instance happens to have a `name` attribute set to "HR Application":
```js
{
  path: '/:foo/most-popular?since=:date',
  query: {
    filter: {
      type: { exact: 'articles' },
      'publish-date': {
        range: { gt: ':date' }
      }
    },
    sort: '-popularity'
  },
  additionalParams: {
    staticValue: 'i am static',
    routingCardData: ':card:name'
  }
}
```
When matched with the path: `https://acme-corp.com/hassan/most-popular?acme-applications[since]=2018-01-01` will result in the following params object being passed to the `articles` card's component:

```js
{
  path: '/hassan/most-popular?acme-applications[since]=2018-01-01',
  foo: 'hassan',
  since: '2018-01-01',
  staticValue: 'i am static',
  routingCardData: 'HR Application'
}
```

### Query Params
A convenience notation is also supported for declaring query parameters consumed by a particular card. If a route omits the `query` property, the router will return the routing card as primary card for the space. In such a manner, you can use the router of a card to simply declare the query parameters that a card can consume. Consider the example where the application card uses the following router:

```js
// <cardstack application folder>/cardstack/static-models.js

factory.addResource('content-types', 'acme-applications')
  .withAttributes({ router: [
    {
      path: '/:type/:id',
      query: {
        filter: {
          type: { exact: ':type' },
          id: { exact: ':id' }
        }
      }
    }]
  });
```

Then you additionally have a content-type `blogs` that uses a query parameter `since` to constrain the articles displayed in a blog instance to only the articles that has been published after the `since` query parameter. To allow the `since` query parameter to be passed to your `blogs` card component, you can specify the following in the `cardstack/static-models.js` to your `blogs` card npm module.

```js
// <@acme-corp/acme-blog card module folder>/cardstack/static-models.js for the `blogs` content-type
// that the application consumes.

factory.addResource('content-types', 'blogs')
  .withAttributes({ router: [
    {
      path: '?since=:since'
    }]
  });
```

In this example, the URL for the blog, which includes the name-spaced query parameter, looks like this:
```
https://<application domain>/blogs/chris?blogs[since]=2018-01-01
```
Note that the namespace for the query parameter `since` is `blogs` since the `blogs` content-type's router is the router that declares the query param in the `{ path: '?since=:since' }` route above.

The card's components can also modify the query params in the browser's URL location, i.e. browser history `pushState()`. Each card's component is decorated with a `setParams(name, value)` action that accepts a query param name and its value. The card can then use the `setParam` action to set query params that have been declared by the router for the card. The namespacing will automatically be added to the query param that is set, so that the card does not need to worry about handling the query param namespacing.
