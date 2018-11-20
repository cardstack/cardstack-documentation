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
        type: 'articles'
      },
      sort: '-publish-date'
    }
  },{
    // This is an example of a using a "slug" or human friendly ID in the URL to identify a card
    // as opposed to the actual card's ID (which may not be easy for a human to remember or type).
    path: '/good-reads/:friendly-id',
    query: {
      filter: {
        type: 'articles',
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
        type: 'articles',
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
        type: ':type',
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
        type: routingCard.data.type,
        id: { exact: routingCard.data.id }
      }
    }
  }];
};
```

The router is leveraged when the client makes a request to get a `space`. A `space` is retrieved by URL. So if the client wants to enter the route `/latest-article`, it makes a request to the API: `GET https://<hub api domain>/api/spaces/%2Flatest-article`. The API then uses the router above to match the path to a particular route whose query will be used to find the card to display to the user. The router will match the path in the order that the routes appear in the router, so the first pattern that matches the path is the one that will be used in the case where potentially two routes match match a path.

Each Cardstack application has an "application card" that is the top level routing card for the cardstack application. Any card can serve as the application card in the cardstack application. If no application card is specified, the hub uses a default, "Getting Started", application card. Additionally if the application card does not specify a router, the hub provided a default router (`@cardstack/routing`) that includes a static mapping route and a vanity URL of "/" to the application card itself. Cardstack applications can specify their application cards in the `plugin-configs/@cardstack-hub` configuration.

In order to specify the name of the router to use for the application card, the cardstack developer can specify an attribute on the application card's content-type `router`. This is set to the feature name of the feature whose router that you want to use. The feature name is the npm module name of the feature. So typically this means that we would specify the npm module name of the card in its content-type's router attribute if we want the card to have a router.

```js
// <card-module-folder>/cardstack/static-model.js for a card that has npm module name of "@acme-corp/acme-application"
// the corresponding router would live in <card-module-folder>/cardstack/router.js within the same npm module

factory.addResource('content-types', 'acme-applications')
  .withAttributes({ router: '@acme-corp/acme-application' })
  .withRelated('fields', [
    factory.addResource('fields', 'application-name').withAttributes({
      fieldType: '@cardstack/core-types::string'
    })
  ]);

```

Additionally, when the router is unable to find a card for the provided path, it will return an error card. A system error card is provided. Cardstack application developers can provide their own custom error cards by creating a content-type that uses an `*-errors` suffix of the routing card's content type. So if the application card's content-type is `acme-applications`, a custom error card for this application card would be the content type of `acme-applications-errors`, and you should have at least one instance of this type with the ID of 'not-found' that is returned when the router cannot find a card for the path provided (this can be established in the `static-model` feature of your custom error card). You can then provide a custom template for this card in the same way a you provide for any card. You should also set a world read grant for this content type, so that errors are not inadvertently hidden for API clients.

When a routing card triggers an error because a card cannot be found for the path, the error will bubble up through all the routing cards that where involved with the routing of the path. The custom error card that is closest to the router that was unable to resolve the path will be the error card that is returned from the server.

Additionally in this PR we have updated the `DocumentContext`, such that if `meta.routing-card`, `meta.routing-id` is provided (as well as hub:plugins so the router can search for features) DocumentContext will add `links.self` to all the resources in the json:api document that it constructs. These are the canonical paths for the resources based on the specified routing card's router. The way that we derive a canonical path for a resource is to introspect the routing card's router and look for (in the following order):

1. A query that matches the specified resource specifically. This is a vanity URL to the resource, and has the highest precedence when deriving a canonical path to the resource.
2. A query that can match the specified resource using a `:friendly_id` in the router. The `:friendly_id` is a special replacement tag in the router that is the developer's signal to the hub that the field should be considered as a identifier for the content. This is what we have previously called the "routing field". This has the second highest precedence when deriving a canonical path to the resource.
3. A static mapping route, where the type and ID are specified as replacement tags in the path, and are used in the query to find a specific resource by type and ID.

The resulting `links.self` property is used by the ember client in order to transition to a particular card's canonical path. Note that it is possible for a router to be fashioned that results in not all cards being routable. In such cases, the `{{cardstack-url}}` helper and various tools that depend on getting the route for a card will be unable to operate for non-routable cards.

The `GET https://<hub api domain>/api/spaces/<path of card>` spaces json:api response has an attribute `query-params` that represents the unconsumed (not used by the router to make a routing decision) query params. These query params are then fed to the resulting card component with the `params` property. Card components can use the `params` property to access their query params. For query params that are used by the router, for example the route `/most-popular?since=:date` in the example router above, these query params must be name-spaced in the actual URL in order for the router to identify and consume the `date` query param. In this example, an actual URL for this route would look like:
```
https://<application domain>/most-popular?since=acme-applications[date]=2018-01-01&highlight-terms=foo
```
where `acme-applications` is the content-type of the routing card that the query param pertains to. The query parameter `highlight-terms` is not specified in the router and as a result is not consumed by the router, and rather, passed to the resulting card. The `space` for this particular path would specify a `query-params` attribute of `"?highlight-terms=foo"`, which would then be passed to the `articles` card's component as the object `{ 'highlight-terms'='foo' }` in the `params` property of the `articles` card component.