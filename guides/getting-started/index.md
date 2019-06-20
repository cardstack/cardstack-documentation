Welcome to Cardstack! Follow these step-by-step instructions to start exploring the Card SDK.

## Installation

First, you need the following installed on your Mac, Linux, or Windows computer:

- [git](https://git-scm.com/)
- [npm](https://www.npmjs.com/get-npm) and [Node.js](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/en/)
- [Docker](https://www.docker.com/get-started) - a free container manager
- [Ember CLI](https://cli.emberjs.com/release/)
- Linux and Mac systems should also install [Watchman](https://facebook.github.io/watchman/)
- If you are developing in a Windows environment, use [Bash](#todo) if you would like to be able to follow this tutorial exactly as written.
- It is optional, but recommended, to install the [Ember Inspector](https://guides.emberjs.com/release/ember-inspector/) for debugging your front end work.

Developers should be familiar with JavaScript, HTML, and git in order to follow
along with these Guides.

## Download an existing project

Developers using Cardstack will spend most of their time working on Cards,
which are reusable across many projects.
The best way to learn the Card SDK is to explore an existing project.
This project is called [Cardboard](https://github.com/cardstack/cardboard), and it's an educational content editor and viewer.

```sh
git clone https://github.com/cardstack/cardboard.git
cd cardboard
yarn install
```

## Start the back end services

Next, we'll start some Docker containers that manage the Cardstack
environment, create an API, and provide a local postgres database that holds your application data.
Check to see if you have Docker running before using these commands.

```sh
yarn start-prereqs
yarn start-hub
```

Leave this tab open and running in your terminal.

If you need to stop the Docker containers, you can use `yarn stop-prereqs`.

These commands will vary across applications, so check out the README
if you are looking at different Cardstack projects.

### Start the front end application

Next, let's start the front end and see Cardstack in action.

```
yarn start-ember
```

Visit [http://localhost:4200](http://localhost:4200) to see the app in action!

![screenshot of the Cardboard project](/images/cardboard-initial.png)

## Next steps

Now that you have the Cardboard project running locally,
through the rest of these guides we'll use examples from this
project and others. Keep reading to learn more!
