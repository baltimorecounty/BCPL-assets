# BCPL-assets
Client side assets for the Baltimore County Public Library website

[![Build Status](https://travis-ci.org/baltimorecounty/BCPL-assets.svg?branch=integration)](https://travis-ci.org/baltimorecounty/BCPL-assets)
[![Coverage Status](https://coveralls.io/repos/github/baltimorecounty/BCPL-assets/badge.svg?branch=integration)](https://coveralls.io/github/baltimorecounty/BCPL-assets?branch=integration)

## Building Files for Distribution

### Setup

You will need to do these steps the first time you setup the project.

1. [Clone this repository](https://help.github.com/articles/working-with-repositories/)
1. Install [Git](https://git-scm.com/downloads) 
1. Install [Node](https://nodejs.org/download/)
1. Install [Python 2.7.x](https://www.python.org/)
1. Install [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
1. Install [C++ build tools](https://www.npmjs.com/package/windows-build-tools) (Must be installed as admin)
1. Open terminal or command prompt to the root of your local repository
1. Run `npm install` to install all local dependencies

### Build

1. Open terminal or command prompt to the root of your local repository
1. Run the `gulp` command

#### This process above will do the following.

1. Compile all pug files into HTML, and copy into the 'dist' folder
1. Compile and minfiy all sass stylesheets to css and place them in the 'dist/css' folder
1. Create, minify, and lint the master js file, and copy into the 'dist/js' folder
1. Copy images into the 'dist/images' folder
1. Copy fonts into the 'dist/fonts' folder

*You may need to [configure node for proxy](http://jjasonclark.com/how-to-setup-node-behind-web-proxy/).
