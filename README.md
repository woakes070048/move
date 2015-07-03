# LMIS-Chrome

[![Build Status][travis-image]][travis-url] [![devDependency Status][daviddm-image]][daviddm-url] [![Code Climate][codeclimate-image]][codeclimate-url]

[travis-url]: https://travis-ci.org/eHealthAfrica/LMIS-Chrome
[travis-image]: https://travis-ci.org/eHealthAfrica/LMIS-Chrome.png?branch=master
[daviddm-url]: https://david-dm.org/eHealthAfrica/LMIS-Chrome#info=devDependencies
[daviddm-image]: https://david-dm.org/eHealthAfrica/LMIS-Chrome/dev-status.png?theme=shields.io
[codeclimate-url]: https://codeclimate.com/github/eHealthAfrica/LMIS-Chrome
[codeclimate-image]: https://codeclimate.com/github/eHealthAfrica/LMIS-Chrome.png

> User centered medical supply management

## Usage

0. Install [Chrome][] [Node.js][] and [Git][]
1. `npm install -g karma grunt-cli bower`
2. `git clone https://github.com/eHealthAfrica/LMIS-Chrome.git`
3. `cd LMIS-Chrome && npm install; bower install`
4. `grunt serve`
5. Launch Chrome and browse to http://localhost:9000

[Chrome]: https://www.google.com/intl/en/chrome/
[Node.js]: http://nodejs.org
[Git]: http://git-scm.com
[chrome://extensions]: chrome://extensions

## Build for release

1. Update version number in package.json
2. Create a tag here on github [in the releases tab](https://github.com/eHealthAfrica/move/releases)
3. Travis will now create a signed build for that tag. Go here [https://travis-ci.org/eHealthAfrica](https://travis-ci.org/eHealthAfrica) and watch it proceed
4. When the build is green, the build can be downloaded from **https://eha-move.s3.amazonaws.com/releases/move-armv7-release-latest.apk**

## Testing

Use `grunt test` for the complete test suite. `npm test` is reserved for our
continuous integration server (TravisCI).

### Unit

Use `grunt test:unit`. During development, `npm run-script test-watch` is
useful to automatically re-run the tests when a file changes.

### e2e

1. Install selenium (one-time only):

    ```bash
    ./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update
    ```

2. `grunt test:e2e`

## Authors

* © 2015 Tom Vincent <tom.vincent@ehealthnigeria.org> (https://tlvince.com)
* © 2015 Jideobi Ofomah <jideobi.ofomah@ehealthnigeria.org>
* © 2015 Musa Musa <musa.musa@ehealthnigeria.org>
* © 2015 Justin Lorenzon <justin.lorenzon@ehealthnigeria.org>
* © 2015 Karl Westin <karl.westin@ehealthnigeria.org>
* © 2015 Femi Oni <oluwafemi.oni@ehealthnigeria.org>

… and [contributors][].

[contributors]: https://github.com/eHealthAfrica/move/graphs/contributors

## License

Released under the [Apache 2.0 License][license].

[license]: http://www.apache.org/licenses/LICENSE-2.0.html
