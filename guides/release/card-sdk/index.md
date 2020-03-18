You can think of a Card as a "mini app" that can be run in different places within an app, or shared between different apps.
For example, someone might build a Card that fetches and displays user information from a GitHub profile.
The information could be displayed on a standalone page, or as a small widget on another page.
Every Card has its own templates, styling, JavaScript files, tests, and more.

In this section of the Guides, you will learn how to run the Card Builder on your own computer
so that you can learn and explore.
In later sections, you will learn how to add and display data for your Card.

The average Cardstack user never needs to look at a terminal or a code editor; they do their
work using visual interactions in the browser. But for developers, there are some
additional powerful tools available, which we refer to as "dev mode." Keep reading to learn more!

## Prerequisites

You'll need the following installed on your computer:
- Node version 12 or later
- Yarn
- git
- Docker
- A Code editor of your choice, such as VSCode, Atom, Vim, etc.

Volta is strongly recommended, but not required.

## Running the builder app locally

First, we'll install the Cardstack repository:

```bash
git clone https://github.com/cardstack/cardstack.git
cd cardstack
yarn install
```

There are a lot of files in here! You just downloaded the Card Builder and many of its key
dependencies.
You will be doing your own work in just a small number of files, so don't worry about most of these.

Next, make sure you have Docker running. Then open up the `cardhost` app files, and run this command
to create a temporary database for your local development work:

```bash
cd packages/cardhost
yarn start-prereqs
```

Now, you can run the app itself:

```bash
yarn start
```

This will spin up two local servers - the Hub, which is a back end server, and the Builder,
which is the front end application that you could use to create cards in a visual way.

Visit this URL in the browser to see your app running: [http://localhost:4200](http://localhost:4200)

If you are having trouble with any of these steps, read the Troubleshooting Tips below or drop by our [Discord chat](http://localhost:4200), and we'll help you get going!

## Try making a Card

Before we look at the code, let's use the visual tools of the Builder to create a Card.
This will be helpful context when we get to "dev mode" later.

From the browser, click on the Profile icon in the left edge and choose "log in."
This allows you to simulate being a logged-in user, and make changes to your own local data,
without requiring a username and password. It is for testing purposes only.

Once you are logged in, in the left edge, click on the Catalog button (it looks like a grid) and
choose a card to make a copy of.

Visit the "Edit" mode to fill in forms, or the "Schema" mode to drag and drop new fields in.
Visit "Layout" and click the "Custom Theme" button to write some CSS.

Feel free to explore! You can't permanently break anything, and your data is all
stored on your computer only.


## Enable dev mode

Now that we know that your local server works, let's turn on dev Mode.
In dev mode, Cards are saved to your hard drive as files, and you can look at the data
that they are made of.

Stop your server from the terminal with `Control-C`.

Next, create a new directory somewhere on your hard drive. This will be the folder for
your new cards. Use `pwd` to print the full directory path. You'll need it in the next step.

```bash
mkdir my-cards
pwd
```

Now, start your local server and set `DEV_DIR` to your own path:

```bash
DEV_DIR="your/path/goes/here" yarn start
```

If you change this path at any time, be sure to restart your prerequisites too:
`yarn stop-prereqs` and `yarn start-prereqs`.

Now, try creating another card in the builder.

You will see your card show up in the `DEV_DIR` you specified!
If you want, you can create more cards just like it by constructing its
associated files.

In some cases, this is faster or more powerful than creating cards directly in the
builder; it is a tool at your disposal as a Card Creator!

## Troubleshooting tips

Having trouble? Not sure where to look? These notes might help you out as you create Cards, add sample data records, and try to display them.

- Make sure you are running Node version 12 or later. Try `node -v` in the terminal
- Is Docker running? Try `docker ps`. If it says "Cannot connect," launch the Docker app, wait until it is finished loading, and try again.
- To see the data available in the local Cardstack Hub database, you can use postgres and SQL commands. In the terminal, run `docker exec -it cardstack-pg psql -U postgres pgsearch_cardboard_development`. This will open up a postgres shell. Many columns in tables are quite wide, so try selecting only from specific columns like `id`. The `documents` table is where Card data goes, so a sample query could be `SELECT id FROM documents;`
- Did you get the latest commits from the `master` branch of the Cardstack repository, and now things don't work? You might have some build artifacts lying around. Commit any work you want to keep, then delete the `packages` and `cards` directories. Clear out your `node_modules` throughout the repository with `npx lerna clean`. Run `git reset --hard HEAD` to discard all uncommitted changes (i.e. get a clean slate), then `yarn install`. Stop your local database with `yarn stop-prereqs`. Finally, follow the tutorial steps above, beginning with `yarn install` to start the database and the app again.
- Visit our [Discord chat](http://localhost:4200) for help

## Learn more

Cards are a lot more than just components. See [Cards at Rest, Cards in Motion](https://medium.com/cardstack/cards-at-rest-cards-in-motion-4a0f88a8b6c5) and [Building the Card Catalog](https://medium.com/cardstack/building-the-card-catalog-bf034445d05e) to learn more about what makes them different from traditional web apps.

You can also watch the [Card Folio community demo](https://medium.com/cardstack/cardstacks-card-folio-app-community-demo-c81b873ab596) and read [Community Q&A](https://medium.com/cardstack/community-q-a-the-card-folio-app-c07125a2e18d) to get the big picture for how Cards compose together.
