git checkout master
git fetch
git remote prune origin
git branch --merged master | grep -v "master" | xargs git branch -d
git branch -r --merged master | sed 's/ *origin\///' | grep -v "master" | xargs -I% git push origin :%