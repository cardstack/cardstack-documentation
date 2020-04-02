With the [git plugin](https://github.com/cardstack/cardstack/tree/v0.14.49/packages/git) for the Card SDK, you can store your card's data as JSON in a local or remote git repository.
You get an instant, versioned data persistence layer that supports create, read, update, and delete.

In this guide, we will show how to save Card data to git by default.

## Installing and configuring

Install [`@cardstack/git`](https://github.com/cardstack/cardstack/tree/v0.14.49/packages/git) in the `cardhost` of your project:

```sh
cd cardhost
yarn install --dev @cardstack/git
```

## Using a local repository by default

While you are first developing a Card, it can be useful to keep the data in a local git repository, on your own computer.
In this example, we will set up a local repository from scratch, make it the default data source, and save some Card data.

First, create a new directory, outside of your project directory:

```bash
cd ..
mkdir project-data
```

Next, initialize the repository:

```bash
cd project-data
git init
```

In order for data to be saved to a branch, the branch has to exist first.
Create a file such as `README.md` and commit it to the `master` branch.
The first commit is what establishes that `master` exists.

```bash
touch README.md
git add README.md
git commit -m "initial commit"
```

Now that the repository is set up, we need to configure the plugin to
use it. You will need to know the absolute path to your data repository.

```bash
pwd
# prints /the/path/to/your/project-data/
```

In `cardhost/cardstack/data-sources/default.js` for your project, set your default data source to git.
This configuration should replace any existing defaults,
such as `@cardstack/ephemeral`.

```javascript
{
    type: 'data-sources',
    id: 'default',
    attributes: {
      'source-type': '@cardstack/git',
      params: {
        repo: '/the/absolute/path/to/your/project-data/'
      }
    },
  }
```

Now if you start up your Card, you will be using the local git repository to store data! If you use the Edges to save data, and you run `git status` in your local repository, you will see its changes. You can also look at the files inside your data repository if you are curious to see what the Card's JSON.

### Troubleshooting local repositories

- *Any problem* - did you restart your server after making changes to the data sources?
- *Can't start the app* - If you have trouble starting up your project after adding the git data source, double check that the path is correct and that you have at least one commit on the branch that git should target.
- *My seed data is missing!* - When you define seed data for your project, it goes into the ephemeral data source. Therefore, you will not see that seed data if you have changed a Card's data source to git.
- *Error, cannot locate local branch* - Make sure you have at least one commit on your target branch. If you decide to use the `branchPrefix` configuration, you will need to make a first commit on that branch as well. For example, if your `branchPrefix` is `cs-`, then make a commit on `cs-master`. If you are not using `branchPrefix`, make a commit to `master` and restart your server.

## Remote data

Now it is time to use a remote data source, such as a repository on [GitHub](https://github.com)! You will need a GitHub account with an [ssh key set up](https://help.github.com/en/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent). Although this example uses GitHub, you could use the git plugin with other remote hosts too.

First, create a repository on GitHub and initialize it with a `README.md`:

![screenshot showing the README option checked](/images/github-create-repo.png)

Make sure to choose "private" if you don't want to expose your data with the world. Choose "public" if you want to share your work with the open source community.

After you have created the repository, copy the `ssh` URL, such as `git@github.com:my-username/project-data.git`.

Now in `cardhost/cardstack/data-sources/default.js`, configure your project to use the remote repository. Make sure to replace `your-username` with your GitHub username or organization name:

```javascript
{
    type: 'data-sources',
    id: 'default',
    attributes: {
      'source-type': '@cardstack/git',
      params: {
        remote: {
          url: 'git@github.com:your-username/project-template-data.git',
          privateKey: process.env.GIT_PRIVATE_KEY,
        }
      }
    }
  }
```

*Never ever commit a file containing your private key.* If someone has your private key, they could delete anything on your GitHub, deploy malicious code, and other bad things.

Always use an environmental variable to provide your key. You can do this from the command line:

```bash
GIT_PRIVATE_KEY="your private key here"
```

Now if you start up your project, make some changes, and save them, it should be using your repository on GitHub!
If you watch the console for your server, you will see it pull the repository and start indexing. When you save a Card, you will see a POST request go out, and you can view the record on GitHub.

### Troubleshooting remote repositories

- *Any problem* - did you restart your server after making changes to the data sources?
- *Cannot save data* - Check to make sure that you have provided the correct path to your private key
- *Cannot find branch* - Just like for local repositories, if you configure a `branchPrefix`, make sure that branch exists before starting your project server

## Advanced use

There are many more configurations possible with the git plugin than we have shown here. Check out the `README` for [`@cardstack/git`](https://github.com/cardstack/cardstack/tree/v0.14.49/packages/git) to learn how to customize the file paths, branches, and more.

## Why use git?

git has many advantages, including versioning, the ability to compare current and past states, and rollback capabilities.
In a git data source, as something changes, its entire history is preserved.
Data stored using git can be persisted in many different ways, such as in a postgres database or even a GitHub repository, such as that used for the [Cardboard demo app](https://github.com/cardstack/cardboard-data).

## Learn more

You can find the source code for the `@cardstack/git` package [here](https://github.com/cardstack/cardstack/tree/v0.14.49/packages/git).
