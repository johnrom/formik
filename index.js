'use strict'

/**
 * JR: I have no idea why Rollup is adding the scope to these two files.
 */
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./@johnrom/formik.cjs.production.js');
} else {
  module.exports = require('./@johnrom/formik.cjs.development.js');
}
