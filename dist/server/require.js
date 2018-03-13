'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pageNotFoundError = pageNotFoundError;
exports.normalizePagePath = normalizePagePath;
exports.getPagePath = getPagePath;
exports.default = requirePage;

var _path = require('path');

function pageNotFoundError(page) {
  var err = new Error('Cannot find module for page: ' + page);
  err.code = 'ENOENT';
  return err;
}

function normalizePagePath(page) {
  // If the page is `/` we need to append `/index`, otherwise the returned directory root will be bundles instead of pages
  if (page === '/') {
    page = '/index';
  }

  // Resolve on anything that doesn't start with `/`
  if (page[0] !== '/') {
    page = '/' + page;
  }

  // Windows compatibility
  if (_path.sep !== '/') {
    page = page.replace(/\//g, _path.sep);
  }

  // Throw when using ../ etc in the pathname
  var resolvedPage = (0, _path.normalize)(page);
  if (page !== resolvedPage) {
    throw new Error('Requested and resolved page mismatch');
  }

  return page;
}

function getPagePath(page, _ref) {
  var dir = _ref.dir,
      dist = _ref.dist;

  var pageBundlesPath = (0, _path.join)(dir, dist, 'dist', 'bundles', 'pages');

  try {
    page = normalizePagePath(page);
  } catch (err) {
    console.error(err);
    throw pageNotFoundError(page);
  }

  var pagePath = (0, _path.join)(pageBundlesPath, page); // Path to the page that is to be loaded

  // Don't allow wandering outside of the bundles directory
  var pathDir = (0, _path.parse)(pagePath).dir;
  if (pathDir.indexOf(pageBundlesPath) !== 0) {
    console.error('Resolved page path goes outside of bundles path');
    throw pageNotFoundError(page);
  }

  return pagePath;
}

function requirePage(page, _ref2) {
  var dir = _ref2.dir,
      dist = _ref2.dist;

  var pagePath = getPagePath(page, { dir: dir, dist: dist });

  try {
    return require(pagePath);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      throw pageNotFoundError(page);
    }
    console.error(err);
    // If this is not a MODULE_NOT_FOUND error,
    // it should be something with the content of the page.
    // So, Next.js rendering system will catch it and process.
    throw err;
  }
}