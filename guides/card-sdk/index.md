You can think of a Card as a "mini app" that can be run in different contexts.
For example, someone might build a Card that fetches and displays user information from a GitHub profile.
The information could be displayed on a standalone page, or as a small widget on another page.

## Generating the project files

```sh
cd cards
ember addon my-card-name --skip-git
mkdir my-card-name/cardstack
```

Add the following dependencies to `my-card-name/package.json`:

```sh
yarn add --save-dev @cardstack/eslint-config @cardstack/files @cardstack/github-auth @cardstack/image @cardstack/jsonapi @cardstack/mobiledoc @cardstack/mock-auth @cardstack/routing @cardstack/test-support @cardstack/tools
```

With these commands, we have created the overall project structure.
It will take more than this to get your card running, so keep reading to learn how to add templates, routes, and schema for your Card.

## Combination of Data and Presentation

One of the key concepts that is fundamental to the idea of a Cardstack Card is that there is a tight coupling between the data backing a Card and the presentational aspects of a Card. When referring to a card you are talking about the visual elements but also the data model that describes the attributes of that Card.

## Learn more

Cards are a lot more than just components. See [Cards at Rest, Cards in Motion](https://medium.com/cardstack/cards-at-rest-cards-in-motion-4a0f88a8b6c5) and [Building the Card Catalog](https://medium.com/cardstack/building-the-card-catalog-bf034445d05e) to learn more about what makes them different from traditional web apps.

You can also watch the [Card Folio community demo](https://medium.com/cardstack/cardstacks-card-folio-app-community-demo-c81b873ab596) and read [Community Q&A](https://medium.com/cardstack/community-q-a-the-card-folio-app-c07125a2e18d) to get the big picture for how Cards compose together.
