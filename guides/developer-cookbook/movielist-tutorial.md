Until this point, we have covered the essential concepts and features of a Cardstack application. Now, it is time for you to try out your new skills and knowledge on an interactive tutorial. In this tutorial, we will build a Movie Tracking application using the Cardstack framework.

Movies are irreplaceable parts of the 21st century social life. People are continuously watching new movies and receiving recommendations from friends. Let's build a tool that can record all the movies that you have watched, are currently watching, or have noted to watch. By the time you are done with this tutorial, you will know how to create new data, display it, enable an editing mode, add interactive filters, and save the results to the back end.

## Create the main project files

First, go ahead and clone this GitHub repo, which is an empty [Cardstack Project Template](https://github.com/cardstack/project-template).

```bash
git clone https://github.com/cardstack/project-template.git
```

## Creating the Movie Card

In order to record each movie, we will need to create a card called `movie`. Go ahead, and paste these commands to your Terminal:

```bash
`cd project-template`

`cd cardhost`

`ember generate card movie`
```

Next, add your new card to the `devDependencies` of `cardhost/package.json`:

```json
"cardhost-movie": "*",
```

Don't forget to run `yarn install` in your Terminal after doing any change to the `devDependencies`!

## Adding the Movie Fields

Even though we created a card that will resemble the movie data, we need to specify which properties of a movie this movie card will have. We will define the data backing of a card in its schema, which is in a `static-model.js` file. Let's view this file at `cards/movie/cardstack/static-model.js`.

You should be seeing the default schema:

```js
const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');

let factory = new JSONAPIFactory();
factory.addResource('content-types', 'movies')
  .withRelated('fields', [
    factory.addResource('fields', 'title').withAttributes({
      fieldType: '@cardstack/core-types::string'
    })
  ]);

let models = factory.getModels();
module.exports = function() { return models; };
```

Besides a title, a movie should have a year, a genre, a short summary, and a boolean value for whether it is still playing or not. Go ahead and replace the code in the movie schema with the below code:

```js
const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');

let factory = new JSONAPIFactory();
factory.addResource('content-types', 'movies')
  .withRelated('fields', [
    factory.addResource('fields', 'title').withAttributes({
      fieldType: '@cardstack/core-types::string',
    }),
    factory.addResource('fields', 'year').withAttributes({
      fieldType: '@cardstack/core-types::integer'
    }),
    factory.addResource('fields', 'genre').withAttributes({
      fieldType: '@cardstack/core-types::string',
    }),
    factory.addResource('fields', 'summary').withAttributes({
      fieldType: '@cardstack/core-types::string',
    }),
    factory.addResource('fields', 'playing').withAttributes({
      fieldType: '@cardstack/core-types::boolean'
    }),
    factory.addResource('fields', 'notes').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),
  ]);

let models = factory.getModels();
module.exports = function() { return models; };

```

## Viewing the Movie Card

In order to view a card, we first need to design its template view. For now, we can just work on the `isolated` view of our movie card. Follow the path `cards/movie/addon/templates/isolated.hbs` and replace the existing code with the following:

```handlebars
<div class="movie-isolated">
  <h1 data-test-movie-isolated-title>Title: {{content.title}}</h1>
  <h1 data-test-movie-isolated-year>Year: {{content.year}}</h1>
  <h1 data-test-movie-isolated-genre>Genre: {{content.genre}}</h1>
  <h1 data-test-movie-isolated-short-summary>Short Summary: {{content.summary}}</h1>
  <h1 data-test-movie-isolated-playing>Currently Playing: {{#if content.playing}} Yes {{else}} No {{/if}}</h1>
  <h1 data-test-movie-isolated-notes>Notes: {{content.notes}}</h1>
</div>
<br><br><br>
<h3><a href='/'>Click to go back to the list.</a></h3>
```

Now that we have a schema and a template view for this movie card, we can create an instance of it. Paste the code below inside the `if` statement in the `cardhost/cardstack/seeds/data.js`:

```js
factory.addResource('movies', 1).withAttributes({
    title: 'Avengers Endgame',
    year: 2019,
    genre: 'adventure',
    summary: 'After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos actions and restore balance to the universe.',
    playing: true,
    notes: ''
  });
```

Now go ahead and run these commands in your terminal:

```bash
yarn install
yarn start-prereqs
yarn start
```
The app is now running in `localhost:4200`, and if you use the route `/movies/1`, you can see the isolated template of your movie card.

Congratulations!! You just created, structured and viewed your first Cardstack Card.

## Adding more seed data

Now that you know how to create an instance of a movie card, you can go ahead and store more Marvel Cinematic Universe movies to your schema. Inside the `cardhost/cardstack/seeds/data.js` you can create your own movie cards, or just use the code below:

```js
factory.addResource('movies', 2).withAttributes({
    title: 'Spiderman: Far From Home',
    year: 2019,
    genre: 'adventure',
    summary: 'Following the events of Avengers: Endgame, Spider-Man must step up to take on new threats in a world that has changed forever.',
    playing: false,
    notes: ''
  });
  factory.addResource('movies', 3).withAttributes({
    title: 'Thor Ragnarok',
    year: 2017,
    genre: 'comedy',
    summary: 'Thor (Chris Hemsworth) is imprisoned on the planet Sakaar, and must race against time to return to Asgard and stop Ragnarök, the destruction of his world, at the hands of the powerful and ruthless villain Hela (Cate Blanchett).',
    playing: false,
    notes: ''
  });
  factory.addResource('movies', 4).withAttributes({
    title: 'Doctor Strange',
    year: 2016,
    genre: 'science-fiction',
    summary: 'While on a journey of physical and spiritual healing, a brilliant neurosurgeon is drawn into the world of the mystic arts.',
    playing: false,
    notes: ''
  });
  factory.addResource('movies', 5).withAttributes({
    title: 'Black Widow',
    year: 2020,
    genre: 'horror',
    summary: 'Not announced',
    playing: false,
    notes: ''
  });
  factory.addResource('movies', 6).withAttributes({
    title: 'Iron Man',
    year: 2008,
    genre: 'adventure',
    summary: 'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.',
    playing: false,
    notes: ''
  });
  factory.addResource('movies', 7).withAttributes({
    title: 'Captain America Civil War',
    year: 2016,
    genre: 'action',
    summary: 'Political involvement in the Avengers affairs causes a rift between Captain America and Iron Man.',
    playing: false,
    notes: ''
  });
  factory.addResource('movies', 8).withAttributes({
    title: 'Guardians of the Galaxy Vol. 3',
    year: 2020,
    genre: 'comedy',
    summary: 'Not announced',
    playing: false,
    notes: ''
  });
```


## Creating the Main Board

For our application, we will also need a main board card where we will display and categorize the movie cards. So, let's go ahead and create the main-board card. Repeat the steps from 'Creating the Movie Card' section, but replace 'movie' with 'main-board'.

## Adding the Main-Board Fields

For the movie card, we just added some basic features for holding data. In the `main-board` card, we will use the magic of the Cardstack application, and put multiple movie cards into the `main-board` card. Go to the `cards/main-board/cardstack/static-model.js` and replace the existing code with the following code:

```js
const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');

let factory = new JSONAPIFactory();
factory.addResource('content-types', 'main-boards')
  .withAttributes({
    defaultIncludes: ['movies', 'to-watch-movies','currently-watching-movies','watched-movies'],
    fieldsets: {
      isolated: [
        {field: 'movies', format: 'embedded'}, 
        {field: 'to-watch-movies', format: 'embedded'},
        {field: 'currently-watching-movies', format: 'embedded'},
        {field: 'watched-movies', format: 'embedded'}
      ]
    }
  })
  .withRelated('fields', [
    {type: 'fields', id: 'title'},
    factory.addResource('fields', 'message').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),

    factory.addResource('fields', 'watched-movies').withAttributes({
      fieldType: '@cardstack/core-types::has-many',
      editorComponent: 'field-editors/dropdown-search-multi-select-editor',
    })
    .withRelated('related-types', [{ type: 'content-types', id: 'movies' }]),

    factory.addResource('fields', 'currently-watching-movies').withAttributes({
      fieldType: '@cardstack/core-types::has-many',
      editorComponent: 'field-editors/dropdown-search-multi-select-editor',
    })
    .withRelated('related-types', [{ type: 'content-types', id: 'movies' }]),

    factory.addResource('fields', 'to-watch-movies').withAttributes({
      fieldType: '@cardstack/core-types::has-many',
      editorComponent: 'field-editors/dropdown-search-multi-select-editor',
    })
    .withRelated('related-types', [{ type: 'content-types', id: 'movies' }]),
  ]);

let models = factory.getModels();
module.exports = function() { return models; };
```
## The Main-Board Fields Explained

This Cardstack SDK feature deserves a little more attention, so we will try to understand it more. 

Let's first take a look at the `.withRelated` portion of the schema. Notice the `{type: 'fields', id: 'title'}` notation, which is different than our regular `factory.addResource()` notation. Since we already created a `field` with the `id` 'title' in the movie card, we can access it with this notation, and this works for every card in this application. This is a very powerful feature, since it prevents redundant `fields` and memory usage. 

Second, all three of the `watched-movies`, `currently-watching-movies`, and `to-watch-movies` fields have their own `.withRelated` portions. The reason behind this is their special `fieldTypes`. Instead of a primitive data type, these fields have a `has-many` relationship with, in this case, `movies` `content-type`. In other words, each of these fields will be related to a bunch of movies, so we can use them as lists. We will see have we can display these movies after.

Third, let's take a look at the `withAttributes` portion of the schema. Remember that `defaultIncludes` attribute sets which fields to be included at the start of the application. In our case, we want all of our fields to be included. Moreover, remember that `fieldsets` attribute helps us to set which fields to be displayed in a particular format. In our case, we won't be using the `embedded` view of the main-board card, and want to include all fields in the `isolated` view.

## Viewing the Main-Board Card

Now that we set up our schema for the `main-board` card, we can go ahead and create our first `main-board` instance. Copy the code below to inside the `if` statement in the `cardhost/cardstack/seeds/data.js`:

```js
factory.addResource('main-boards', 'main').withAttributes({
    title: 'Welcome to your personalized Movie Tracker',
    message: 'Please choose which category to view'
  })
  .withRelated('watched-movies', [
    { type: 'movies', id: '1' },
    { type: 'movies', id: '2' },
  ])
  .withRelated('currently-watching-movies', [
    { type: 'movies', id: '3' },
    { type: 'movies', id: '4' },
  ])
  .withRelated('to-watch-movies', [
    { type: 'movies', id: '5' },
    { type: 'movies', id: '6' },
  ]);
```

As you can see, since we already created the movie instances, we can relate them to appropriate fields, or in our case movie lists, using this configuration.

Now that we set our data backing with the schema, we can go ahead and design the frontend in `cards/main-board/addon/templates/isolated.hbs`. It will take a few steps before you will be able to see the main board rendering without errors. First, you can replace the existing code with the following code:

```handlebars
<div class="main-board-isolated">
  <h1 data-test-main-board-isolated-title>{{content.title}}</h1>
  <h3 data-test-main-board-isolated-message>{{content.message}}</h3>
  <br><br>
  <div class='container list-types-buttons'>
    <div class='btn-group'>
      <button {{action showSelectedMovies 'watchedMovies'}}>Watched Movies</button>
      <button {{action showSelectedMovies 'currentlyWatchingMovies'}}>Currently Watching Movies</button>
      <button {{action showSelectedMovies 'toWatchMovies'}}>To Watch Movies</button>
    </div>
  </div>
  <div class="movie-list">
    {{#if showBoard}}
      {{#if (eq movieAmount 1)}}
        <h3 data-test-main-board-isolated-title>There is 1 movie on this list.</h3>
      {{else}}
        <h3 data-test-main-board-isolated-title>There are {{movieAmount}} movies on this list.</h3>
      {{/if}}
      <ol>
        {{#cs-field content selectedStatue as |movies|}}
          {{#each movies as |movie|}}
            <li>{{cardstack-content content=movie format='embedded'}}</li>
          {{/each}}
        {{/cs-field}}
      </ol>
    {{/if}}
  </div>
</div>
```

We will talk more about the syntax of this template when we start implementing the Editor for this app. However, we need to take two more steps before we view the main-board.

First, you might have noticed that we used actions and variables in this template, so you need to replace the existing code in `cards/main-board/addon/components/isolated.js` with the below code as well:

```js
import Component from '@ember/component';
import layout from '../templates/isolated';
import { computed } from '@ember/object';

export default Component.extend({ 
    layout,
    init() {
        this._super(...arguments);
        this.set('statues', {
            'watchedMovies' : this.content.watchedMovies,
            'currentlyWatchingMovies' : this.content.currentlyWatchingMovies,
            'toWatchMovies' : this.content.toWatchMovies,
        })
    },
    showBoard: false,
    selectedStatue: "",

    movieAmount: computed('selectedStatue', function() {
        return this.get('statues')[this.get('selectedStatue')].length;
    }),

    showSelectedMovies: function(statue) {
        this.set('showBoard', true);
        this.set('selectedStatue', statue);
    }

 });
```
Second, we want to put the `movie` cards on top of the `main-board` card. In this case, we need to use the `embedded` format of the `movie` card. Go ahead, and replace the code in the `cards/movie/addon/templates/embedded.hbs` with the following:

```handlebars
<div class='movie-embedded-view'>
<a class="movie-embedded" href={{cardstack-url content}} >
  <h3 data-test-movie-isolated-title>Title: {{content.title}}</h3>
  <h3 data-test-movie-isolated-title>Year: {{content.year}}</h3>
  <h3 data-test-movie-isolated-title>Genre: {{content.genre}}</h3>
</a>
</div>
```
Notice that we didn't include all the `fields` in the `embedded` view, since this format is meant to be a sneek peak of a card. Also notice that the tag
```html
<a class="movie-embedded" href={{cardstack-url content}} >
```
turns this template into a link that will get us to the `isolated` format of the `movie` card thanks to the Cardstack's build-in `{{cardstack-url}}` helper.

Last but not least, in order to have a better looking application, add some styles in `cards/movie/addon/styles/movie-embedded.css`: 

```css
.movie-embedded {
  display: block;
  text-decoration: none;
  text-align: center;
  color: black;
}
.movie-embedded-view {
  border: 1px black dashed;
  border-radius: 25px;
  width: 350px;
}
```
For `cards/main-board/addon/styles/main-board-isolated.css`, add this:

```css
.main-board-isolated {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  border: 1px blue dashed;
}

.movie-list {
  display: flex;
  justify-content: center;
}
```

Now, you can run the application and follow the route `/main-boards/main` and you will see a Movie Tracking application!

## Routing
We designed this code in a way that `main-board` card is the default view. So, you can go to the `cardhost/cardstack/router.js` and replace the code with the following code:

```js
module.exports = [{
  path: '/:type/:id',
  query: {
    filter: {
      type: { exact: ':type' },
      id: { exact: ':id' }
    }
  },
},{
  path: '/',
  query: {
    filter: {
      type: { exact: 'main-boards' },
      id: { exact: 'main' }
    }
  },
}];
```

## Editing the Data

Our application is visually working right now, yet it is not interactive. An important aspect of the Cardstack Framework is its built-in Editor for adding, editing, or deleting data from an application. To enable this editing mode, go to the `cards/main-board/addon/templates/isolated.hbs` and paste:

```html
{{#mock-login as |login|}} <button {{action login}}>Edit Content</button>{{/mock-login}}
```
just before the `<br><br>`. Now, if you run the app again, and click on the `Edit Content` button, you will see a purple button appear on the right hand corner. If you click on that, you can display the Editor component, but you won't be able to make any edits until we have added some Grants.

The {{#mock-login}} helper is a built-in helper for enabling the Editor while you are developing the app locally. To set up real authentication and authorization, please visit the [Cardboard](https://github.com/cardstack/cardboard) for more details.

## Grants to Edit Content

Now that we have access to the Editor, we need to set some grants on the card schemas to edit content. Go to the `cards/movie/cardstack/static-model.js` and past the code at the bottom, again above the last two lines. 

```js
factory.addResource('grants', 'movie-world-read')
  .withRelated('who', [{ type: 'groups', id: 'everyone' }])
  .withRelated('types', [
    { type: 'content-types', id: 'movies' }
  ])
  .withAttributes({
    'may-read-resource': true,
    'may-read-fields': true,
  });

factory.addResource('grants', 'movie-writers-update')
  .withRelated('who', [{ type: 'groups', id: 'everyone' }])
  .withRelated('types', [
    { type: 'content-types', id: 'movies' }
  ])
  .withAttributes({
    'may-create-resource': true,
    'may-update-resource': true,
    'may-delete-resource': true,
    'may-write-fields': true
  });
```
Likewise, go to the `cards/main-board/cardstack/static-model.js` and paste this code at the bottom, above the last two lines:

```js
  factory.addResource('grants', 'main-board-world-read')
  .withRelated('who', [{ type: 'groups', id: 'everyone' }])
  .withRelated('types', [
    { type: 'content-types', id: 'main-boards' }
  ])
  .withAttributes({
    'may-read-resource': true,
    'may-read-fields': true,
  });

factory.addResource('grants', 'main-board-writers-update')
  .withRelated('who', [{ type: 'groups', id: 'everyone' }])
  .withRelated('types', [
    { type: 'content-types', id: 'main-boards' }
  ])
  .withAttributes({
    'may-create-resource': true,
    'may-update-resource': true,
    'may-delete-resource': true,
    'may-write-fields': true
  });
```
Last but not least, we need to set grants from the overall application schema as well. Go to the `cardhost/cardstack/static-model.js`. Inside the file, find the grants:
```js
factory.addResource('grants', 'cardstack-files-world-read')
```

and 

```js
factory.addResource('grants', 'cardstack-files-writers-create')
```

and then replace only the section with these two grants with the below code:

```js
factory.addResource('grants', 'cardstack-files-world-read')
    .withRelated('who', [{ type: 'groups', id: 'everyone' }])
    .withRelated('types', [
      { type: 'content-types', id: 'cardstack-files' },
      { type: 'content-types', id: 'cardstack-images' },
      { type: 'content-types', id: 'movies' },
      { type: 'content-types', id: 'main-boards' },
    ])
    .withAttributes({
      'may-read-resource': true,
      'may-read-fields': true,
    });

  factory.addResource('grants', 'cardstack-files-writers-create')
    .withRelated('who', [{ type: 'groups', id: 'github-writers' }])
    .withRelated('types', [
      { type: 'content-types', id: 'cardstack-files' },
      { type: 'content-types', id: 'cardstack-images' },
      { type: 'content-types', id: 'movies' },
      { type: 'content-types', id: 'main-boards' },
    ])
    .withAttributes({
      'may-write-fields': true,
      'may-create-resource': true,
      'may-update-resource': true,
      'may-delete-resource': true
    });
```

Great! Now, if you restart your local server, you have full control over the cards via the Editor.

## Quick Tips for the Editor
Note: You should always activate the Editor with the 'Edit Content' button before using it!

- You can select any of the movie list categories, and then add a movie from the movies data are in the storage(the ones in the `cards/movie/cardstack/static-model.js`) Likewise, you can dleete any movie from the particular list as well.

![Adding new movies to the lists](/images/movielist-tutorial/editor_main_board_view.png)

- You can click on the movies to view the movie card in `isolated` format. In that route, you can click on the pencil symbol and edit any `field` of the movies. When you finish editing a movie, hit the 'Save' button, and then to the check symbol.

![Editing an already existing movie](/images/movielist-tutorial/editor_old_movie.png)

- Using the `+` button at the bottom of the editor, you can create a new record. However, in order to save the new record, you need to hit the 'Save' button and wait until the 'Draft' sign turn into 'Published'. After you create a new record, you can then go back to the main page, and add that movie into a particular list.

![Adding a new movie record](/images/movielist-tutorial/editor_new_movie.png)

Note: It is also important to note that the Editor can only access to the data of the `fields` that are used in the templates. That is the reason why you can only view the `fields` related tot he movielist when you click on the related button and activate the component on the template. 

There are two ways to access the data of the `fields` from inside of a template:

- First way is to access to the data of the `fields` with `{{content.foo}}` syntax. However, this syntax renders the `field` according to its `filedType`. We recommand the usage of this syntax when the `fieldType` is a primative type, such as strings, integer, boolean, etc.

- For the second way, recall the syntax that we used in the `cards/main-board/addon/templates/isolated.hbs`:

```html
{{#cs-field content selectedStatue as |movies|}}
```

This is a special way to introduce `fields` of a card if you only need its data, and do not want to render any view, such as our movie lists. We recommend the usage of this `{{#cs-field content 'fieldID' as |foo| }}` for `fieldTypes` such as `@cardstack/core-types::has-many` or `@cardstack/core-types::belongs-to`.

## Closing
This is the end of our Interactive Movie List Tutorial. Since this is a beginners tutorial, we designed our application in a way that the users can create their own movie records and get familiar with the `schema` and creating card instances manually. Therefore, this application is ideal for tracking long movie series, such as the Marvel Cinematic Universe. 

Cardstack has a high quality plug-in functionality, so it is possible to make this application more advanced, and gather movie data from thrid-party APIs, such as IMDb. Stay tuned for a future advanced tutorial!

Thanks for your time, and we hope you liked developing with the Cardstack SDK!
If you have any questions or feedback on this tutorial, you can reach the engineering team on [Discord](https://medium.com/cardstack/the-brand-new-official-cardstack-discord-channel-4a2ffd925cee) or open Issues and PRs on [GitHub](https://github.com/cardstack/cardstack-documentation/).
