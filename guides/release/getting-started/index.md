Welcome to Cardstack!
We've built tools to help people build their own SaaS products without any code.
If you are interested in the code-free experience, instead please visit our website
at [cardstack.com](https://cardstack.com) to learn more.

These guides are for web developers who want to use code to get _even more_ out of the Cardstack platform. If that's you, keep reading!

## Installation

First, you need the following installed on your Mac, Linux, or Windows computer:

- [git](https://git-scm.com/)
- [npm](https://www.npmjs.com/get-npm) and [Node.js](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/en/)
- [Docker](https://www.docker.com/get-started) - a free container manager
- [Ember CLI](https://cli.emberjs.com/release/)
- [Chrome](https://www.google.com/chrome/index.html) browser is required
- [Volta](https://docs.volta.sh/guide/getting-started) is optional but highly recommended for the best experience using the Card SDK
- Linux users and _some_ Mac users will need to install [Watchman](https://facebook.github.io/watchman/). Do not use npm to install, and instead follow the instructions on that site. If you are a Mac user experiencing problems where your local servers don't rebuild after you make changes to the codebase, you may need to install Watchman.
- If you are developing in a Windows environment, use [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools), plus [Git Bash](https://gitforwindows.org/) or [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10). For the best learning experience and build performance, we recommend using Mac or Linux. 
- It is optional, but recommended, to install the [Ember Inspector](https://guides.emberjs.com/release/ember-inspector/) for debugging your front end work.
- You will need a code editor of your choice installed. Some examples of user-friendly, free code editors are [VSCode](https://code.visualstudio.com/) and [Atom](https://atom.io/).

If you are already familiar with JavaScript, HTML, CSS, and git, this knowledge will help you on your learning journey.
Whenever possible, we provide copy-and-paste examples so that more people can follow along.

## Download the Card Builder

Developers using Cardstack will spend most of their time working on Cards,
which are mini-apps that are reusable across many projects.
The best way to create a card is using the Card Builder,
which is contained in the `cardhost` package of the `cardstack` repository.


```bash
git clone https://github.com/cardstack/cardstack.git
cd packages/cardhost
yarn install
```

_If you are having problems with the `yarn install` that results in a `make failed` message, the following commands may help: `npm update` and `yarn upgrade`._

## Start your local server

```bash
yarn start-prereqs # starts up the postgres database in a Docker container
yarn start # starts the local servers for the front and back end
```

Visit [http://localhost:4200](http://localhost:4200) in your browser to see the Card Builder in action!
Currently, the Card Builder works best in Chrome, and IE/Edge is not supported.

## Create a Card from a template

We will start by creating a card from a preexisting template.

First, log in. In the left edge will be a profile icon. Click it, and then choose "Log in."
Whenever you are running the Builder on your own computer, you can skip entering a username and password,
since all the data stays on your own computer.

Next, click the grid icon in the bottom left to open up the Card Library.
Click on a template to make a copy of it, and give your new card a name.

Congratulations, you just made your first card!

### Edit the Card's data

If you started from a template, you should be in "Edit Mode."
This is where you can enter information that is specific to your card.
For example, if you chose an event card, you will use Edit mode to enter the name
of the event and the date.

Your changes will be saved automatically as you work!
However, since this is just for local development, those changes will be gone
if you restart your server. To learn more about saving cards long-term,
read our [Card SDK tutorial](../../card-sdk/).

### View your complete card

When you are finished filling in the information, click on the `...` button in the
card header and choose "View." This will show you what the card will look like to
someone you share the card with.

## Create a Card from scratch

There are thousands of different kinds of cards that someone might want to make,
so there may not always be a template to use.
The Card Builder gives you a way to build your own card and template from scratch.

First, click the grid icon in the left edge to open the Library.
Scroll down to the bottom to choose "Blank Card."
Give your card a name, and then click "Create" to enter Schema Mode.

### Customize the Card Schema

A Card's schema is the definition of the fields it has, such as title, date, description, number of attendees, food allergies, favorite color, job title - anything you want!
The Schema Mode lets you add these fields, give them names and descriptions, and choose where they show up.

Try dragging and dropping in a Text Field. Give it an id and a name. The name is user-facing. It will show up in the card's View Mode. Having a clear, understandable id for the field will help anyone who wants to write a custom theme for this card.

Next, go to Edit Mode to enter some data. When you are ready to see what your card looks like, visit the View Mode.

### Add your own visual designs

If you know some CSS, you can customize what your card looks like. Use the `...` menu to access Layout Mode.
Click the "New Custom Theme" button in the right edge to open up the Themer.

Here, you can write CSS to change the style for the Card.
If you need inspiration,
click on the Cardstack icon to visit the home page of the Builder, and check out one of our Featured Cards.

## Use any card as a template

Any Card can be used as a template. Give it a try! Click on the `...` button in the card's header and choose "Adopt." When you Adopt a card, you make a copy of its schema and styling, and then you fill in new data in Edit Mode.

## Use dev mode

Are you ready to try using code to build a card? Check out the [Card SDK tutorial](../../card-sdk/)!

## Learn more

To learn more about the features of the Card SDK, continue reading these Guides or visit our website at
[cardstack.com](https://cardstack.com).
