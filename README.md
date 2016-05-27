## Other repository
This repository contains the webserver of the project, the scripting-project part can be found at `https://github.com/bartdejonge1996/goto-fail`.

# Prerequisites:
Make sure you have installed node and updated it to the latest version (`v6.2.0`)

# Installation instructions:
```
npm install
npm install -g bower
npm install -g gulp
bower install
```
Then make a folder in the root directory of the local clone with the name "project-scp-files" which can remain empty (this is to ensure the project upload from the scripting application works).

# Reports instructions:
Using the command:
```
gulp travisBuild
```
The javascript linter (eslint), our tests and coverage tool are run. The coverage output should be stored on a webpage in the "coverage" folder.

# Run instructions:
```
gulp
```
# Develop instructions:
You need to have nodemon installed globally (`npm install -g nodemon`)
```
gulp develop
```
