NOTE: This file is in the process of being updated for 0.18. It is not currently recommended to follow this tutorial.

Today, the best way to create a Cardstack project is to begin by copying one of the demo projects, such as [Cardboard](https://github.com/cardstack/cardboard) or [portfolio](https://github.com/cardstack/portfolio),
and modifying it to fit your use case.

You will see that the top level `package.json` does not have much in it,
but if you dig into subdirectories, you will see that each part of the project
can have its own dependencies.
This is because Cardstack projects follow a mono-repo structure.
You can learn more about how and why Cardstack uses this structure in the video
[How I learned to stop worrying and love the mono-repo](https://www.youtube.com/watch?v=Q7QPqEAGu_U&list=PLE7tQUdRKcyYWLWrHgmWsvzsQBSWCLHYL&index=24&t=0s).

## File layout

Here are some general patterns that most Cardstack projects follow.

### Cards

The `cards` directory is the place to look to find the "mini apps" that
a project is composed of.
Each Card follows the project structure of an [Ember Addon](https://cli.emberjs.com/release/writing-addons/).
Each Card can have its own independent tests.
When you look at an individual Card's `package.json`, you will see some `@cardstack` dependencies. These are what help turn an Addon into a Card:

```json
"devDependencies": {
    "@cardstack/ethereum": "^0.14.16",
    "@cardstack/jsonapi": "^0.14.16",
    "@cardstack/mobiledoc": "^0.14.16",
    "@cardstack/routing": "^0.14.16",
...
}
```

Each card should also have the following keywords and metadata added to `package.json`. This information helps others find a Card when it is published, and tells the Cardstack environment that the package is a Card:

```json
  "keywords": [
    "cardstack-plugin",
    "ember-addon"
  ],
  "cardstack-plugin": {
    "api-version": 1,
    "src": "cardstack"
  },
```

### Card schema and data

Card schema and data define what information a Card should access and
the shape of that data. Each Card has a `cardstack` directory
that contains files that define how a Card interacts with the environment
it is in.

### Packages

The `packages` directory contains utility functions that can be
shared across Cards.