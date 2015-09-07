'use strict'
/*eslint-env node */

exports.config = {
  specs: [
    'test/e2e/**/*.js'
  ],
  baseUrl: 'http://localhost:9000',
  chromeOnly: true
}
