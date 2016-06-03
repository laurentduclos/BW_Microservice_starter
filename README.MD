# Developement server initial configuration

1. Download docker toolbox on your operating system
2. Start docker machine and bind a terminal session (see: Binding a terminal session to the docker-machine)
3. Run `docker-machine ip` and remember this IP.
4. Now from the root folder of this repositatry run: `docker-compose -f docker-compose.yml up --build`.
The first time this command is ran it will take a significant amount of time. (around 30minutes).
This step will download the inital base images from the docker repo (ubunut, nginx, mongo) AND install the app dependencies
5. You should now be able to reach in your browser: http://[IP ADDRESS FROM STEP 3]


## Binding a terminal session to the docker-machine

In order to interact with the docker host you must bind a terminal session to the docker machine. To do so type:
 1. `docker-machine start` (only if the docker machine wasn't already up)
 2. `docker-machine env default`
 3. `eval $(docker-machine env default)`
This will bind the current terminal session to the docker machine. To bind aditional sessions only the 3rd step is requiered


## Development workflow

1. Start 2 terminals session and bind them to the docker machine (see: Binding a terminal session to the docker-machine)
2. In one of the session startup the docker containers using `docker-compose -f docker-compose.yml up --build`

- To refesh the docker container run `refresh.sh`
- To enable watch mode run `watch.sh` (requires fswatch: https://github.com/emcrisostomo/fswatch)