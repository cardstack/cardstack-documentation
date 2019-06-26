You can think of a Card as a "mini app" that can be run in different places within an app, or shared between different apps.
For example, someone might build a Card that fetches and displays user information from a GitHub profile.
The information could be displayed on a standalone page, or as a small widget on another page.
Every Card has its own templates, styling, JavaScript files, tests, and more.

In this section of the Guides, you will create the essential files for a Card.
In later sections, you will learn how to add and display data for your Card.

## Generating the project files

First, we'll run a command in the terminal that creates the Card's overall directory structure.

```bash
cd my-project-name
ember generate card my-card-name
```

You will see many new files in `cards/my-card-name`. You will do most of your work in just a few of these files,
but you should commit all of them.

Next, you will need to make an addition to the `devDependencies` of the main app's `package.json`. The main app is in a directory that shares a name with your project, such as `my-project-name/my-project-name/package.json`. Here's the format of what to add to `devDependencies`:

```json
"my-project-name-my-card-name": "*",
```

For example, if your project is called "Cardboard" and your Card is "guest-author", you would add:

```json
"cardboard-guest-author": "*",
```

After saving your changes to `package.json`, run this command in the terminal:

```bash
yarn install
```

This will automatically link your Card throughout the app so that you can use it.

Whenever you make changes like adding a new Card or modifying its schema files, be sure to restart
your environment:

```bash
yarn stop-prereqs
yarn start-prereqs
yarn start
```

Lastly, make a CSS file at `my-card-name/tests/dummy/app/styles/app.css`, put a comment in it like `/* todo */`, and commit it. This file is needed for the tests to run.

## What now?

Great, you made the card's files! Continue on to the next section of the Guides to learn how to add some data and show it in the app.

## Troubleshooting tips

Having trouble? Not sure where to look? These notes might help you out as you create Cards, add sample data records, and try to display them.

- Remember to `yarn install` and restart the environment whenever you add a Card or change its schema
- When you generate a Card, run that command from inside `my-project-name/my-project-name` directory.
Otherwise you will get an error, `node_modules appears empty, you may need to run yarn install`.
- Every Card has its own `package.json`. You can always see the full name of your Card as the `name` in the `package.json` for your Card.
- If you want to see which Cards are linked and active in your project, go to the top level
`my-project-name/node_modules` directory, and run `ls -la`. You should see a Card listed there, as well as in the terminal output when you start the application.
- A Card's name in `package.json` is always prefixed by the project name, and a Card must be listed correctly in the main app's `package.json` in order for it to load.
- Note that in many Cardstack API methods, you will use the plural name of your card. For example, if you generated a card called `guest-author`, you will reference it as `guest-authors`. Checking whether something should be singular or plural is always a good first step in debugging.
- To see the data available in the local Cardstack Hub database, you can use posgres and SQL commands. In the terminal, run `docker exec -it cardstack-pg psql -U postgres pgsearch_cardboard_development`. This will open up a postgres shell. Many columns in tables are quite wide, so try selecting only from specific columns like `id`. The `documents` table is where Card data goes, so a sample query could be `SELECT id FROM documents;`

## Learn more

Cards are a lot more than just components. See [Cards at Rest, Cards in Motion](https://medium.com/cardstack/cards-at-rest-cards-in-motion-4a0f88a8b6c5) and [Building the Card Catalog](https://medium.com/cardstack/building-the-card-catalog-bf034445d05e) to learn more about what makes them different from traditional web apps.

You can also watch the [Card Folio community demo](https://medium.com/cardstack/cardstacks-card-folio-app-community-demo-c81b873ab596) and read [Community Q&A](https://medium.com/cardstack/community-q-a-the-card-folio-app-c07125a2e18d) to get the big picture for how Cards compose together.
