# BoatingWay Commons

This is a collection of modules that are shared between BoatingWay services.

## Instructions

The repo is used as a Git Subtree for all microservices that depend on it.

###To add it to a new service:

1- `git remote add bw_commons [url of this repo]`
2- `git read-tree --prefix=bw_commons/ bw_commons master`

The above 2 commands will pull this repository to the *bw_commons* forlder on your local project.

###Modify and sync common modules

If a change need to be made on this repo. You need:

1- Clone this repo and make the modifications
2- Save and push your modifications
3- run: `git subtree pull —prefix=bw_commons/ —squash bw_commons master`
