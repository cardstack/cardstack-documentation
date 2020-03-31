# Maintainers

## Architecture

The Cardstack docs are mainly powered by 3 repos:

- This repo, which contains the markdown files that form the docs. They are arranged by version number.
- The guidemaker-cardstack-template, which determines how the app looks (CSS and templates)
- The guidemaker dependency, which holds the build functionality

For any work that needs to be done, you should first determine which repo is the right place.
If you need to update the dependencies, it is recommended to follow what is being done in the [Ember Guides Repo](https://github.com/ember-learn/guides-source).

## Deploying

Whenever a PR is merged into `master`, Travis will automatically run the scripts that build the app and upload the results to AWS.

### Before deployment of a new version

Check briefly to see if there are any PRs that should be merged into `/release/`, so that they are applied to both the new version we are about to deploy, and the previous version.

### To deploy a new version

1. Clone the guides repository to your local machine
2. Make sure you have a clean git history with `git status`
3. Get the latest commits on `master` using `git pull origin master`
4. Make a branch, i.e. `git checkout -b release-new-version`
5. Create a directory in `guides` for the version that is one less than the "lastest." For example, if the newest release of Ember is `3.9`, you will make a directory for `3.8` that is a copy of `release`. `mkdir guides/vX.Y.0`
6. Copy the contents of `guides/release/` into the new directory, `cp -r release/* vX.Y.0/`
7. Edit `versions.yml` - add the version number to _both_ the end of the list and the `currentVersion`. The last item and `currentVersion` should match.
8. Double check that the new directory that you made is the latest release minus one. Commit the changes and push your branch.
9. Create a PR. Get a review, and merge to `master`. This will trigger an auto deployment via Travis.
