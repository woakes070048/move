#!/usr/bin/env bash
set -e

# Don't upload if we're in a pull request
[[ "$TRAVIS_PULL_REQUEST" == "false" ]] || {
  exit 0;
}

# Don't upload if we're in a branch
[[ "$TRAVIS_BRANCH" == "develop" ]] || {
  exit 0;
}

# Don't upload if we're in a fork
[[ "$TRAVIS_REPO_SLUG" == "eHealthAfrica/move" ]] || {
  exit 0;
}

grunt ng-gettext-transifex-upload
