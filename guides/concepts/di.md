In Ember you have the concept of "name a file the right thing and it will be picked up by the system". This is also true for Cardstack for both the Ember-specific parts and the more backend parts of the system.

For the backend side of this equation we need to think of Cardstack plugins. A Cardstack plugin is just an npm package that has the keyword `cardstack-plugin` in its `package.json`. Cardstack plugins are automatically picked up in a very similar way to how Ember addons are automatically discovered in an Ember app.

Cardstack plugins can have an extra config in the `package.json` file that defines the folder to look for Cardstack Dependency Injection Types/Files. Eg:

```javascript
  "cardstack-plugin": {
    "api-version": 1,
    "src": "cardstack"
  },
```

If you don't have this config in the `package.json` then the Dependency Injection Types/Files will be in the top level of the npm package. A good example of this difference is the `@cardstack/mobiledoc` package (located in `cardstack/cardstack/packages/mobiledoc`) and the `@cardstack/jsonapi` package (located in `cardstack/cardstack/packages/jsonapi`).

You will see that `@cardstack/mobiledoc` is an Ember-Addon, and because of this it is useful to have the cardstack specific plugins in a subfolder, where as @cardstack/jsonapi only provides a single Cardstack Dependency Injection Type/File `middleware.js` so it doesn't make sense to put it in a sub folder.
