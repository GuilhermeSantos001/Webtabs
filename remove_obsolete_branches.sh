#!/bin/bash

# Remove all branches which are merged in to master
# Run this from within your repository, something like:
#     cd /path/to/repo
#     script/remove_obsolete_branches

#-----

BRANCH=${1:-'master'}

# This has to be run from master
git checkout $BRANCH

# Update our list of remotes 
git fetch
git remote prune origin

# Remove local fully merged branches
git branch --merged $BRANCH | grep -v "$BRANCH$" | xargs git branch -d

# Remove remote fully merged branches
echo "The following remote branches are fully merged into $BRANCH and will be removed:"
git branch -r --merged $BRANCH | sed 's/ *origin\///' | grep -v "$BRANCH$"

read -p "Continue (y/n)? "
if [ "$REPLY" == "y" ]
then
  git branch -r --merged $BRANCH | sed 's/ *origin\///' | grep -v "$BRANCH$" | xargs -I% git push origin :%
  
  echo "Done!"
fi
