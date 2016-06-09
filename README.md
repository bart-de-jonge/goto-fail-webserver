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

# Reports instructions:
Using the command:
```
gulp travisBuild
```
The javascript linter (eslint), our tests and coverage tool are run. The coverage output should be stored on a webpage in the "coverage" folder. N.B. A project should be uploaded to the server before testing to ensure proper coverage reports.

# Run instructions:
```
gulp
```
# Develop instructions:
You need to have nodemon installed globally (`npm install -g nodemon`)
```
gulp develop
```
