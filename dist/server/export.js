'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _recursiveCopy = require('recursive-copy');

var _recursiveCopy2 = _interopRequireDefault(_recursiveCopy);

var _mkdirpThen = require('mkdirp-then');

var _mkdirpThen2 = _interopRequireDefault(_mkdirpThen);

var _walk = require('walk');

var _walk2 = _interopRequireDefault(_walk);

var _path = require('path');

var _fs = require('fs');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _constants = require('../lib/constants');

var _render = require('./render');

var _utils = require('./utils');

var _utils2 = require('../lib/utils');

var _asset = require('../lib/asset');

var _runtimeConfig = require('../lib/runtime-config');

var envConfig = _interopRequireWildcard(_runtimeConfig);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(dir, options, configuration) {
    var nextConfig, nextDir, buildId, buildStats, outDir, exportPathMap, exportPaths, renderOpts, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, path, _exportPathMap$path, page, _exportPathMap$path$q, query, req, res, htmlFilename, baseDir, htmlFilepath, html, log;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            log = function log(message) {
              if (options.silent) return;
              console.log(message);
            };

            dir = (0, _path.resolve)(dir);
            nextConfig = configuration || (0, _config2.default)(_constants.PHASE_EXPORT, dir);
            nextDir = (0, _path.join)(dir, nextConfig.distDir);


            log('  using build directory: ' + nextDir);

            if (!(0, _fs.existsSync)(nextDir)) {
              console.error('Build directory ' + nextDir + ' does not exist. Make sure you run "next build" before running "next start" or "next export".');
              process.exit(1);
            }

            buildId = (0, _fs.readFileSync)((0, _path.join)(nextDir, 'BUILD_ID'), 'utf8');
            buildStats = require((0, _path.join)(nextDir, 'build-stats.json'));

            // Initialize the output directory

            outDir = options.outdir;
            _context.next = 11;
            return (0, _del2.default)((0, _path.join)(outDir, '*'));

          case 11:
            _context.next = 13;
            return (0, _mkdirpThen2.default)((0, _path.join)(outDir, '_next', buildStats['app.js'].hash));

          case 13:
            _context.next = 15;
            return (0, _mkdirpThen2.default)((0, _path.join)(outDir, '_next', buildId));

          case 15:
            _context.next = 17;
            return (0, _recursiveCopy2.default)((0, _path.join)(nextDir, 'app.js'), (0, _path.join)(outDir, '_next', buildStats['app.js'].hash, 'app.js'));

          case 17:
            if (!(0, _fs.existsSync)((0, _path.join)(dir, 'static'))) {
              _context.next = 21;
              break;
            }

            log('  copying "static" directory');
            _context.next = 21;
            return (0, _recursiveCopy2.default)((0, _path.join)(dir, 'static'), (0, _path.join)(outDir, 'static'), { expand: true });

          case 21:
            if (!(0, _fs.existsSync)((0, _path.join)(nextDir, 'static'))) {
              _context.next = 25;
              break;
            }

            log('  copying "static build" directory');
            _context.next = 25;
            return (0, _recursiveCopy2.default)((0, _path.join)(nextDir, 'static'), (0, _path.join)(outDir, '_next', 'static'));

          case 25:
            if (!(0, _fs.existsSync)((0, _path.join)(nextDir, 'chunks'))) {
              _context.next = 31;
              break;
            }

            log('  copying dynamic import chunks');

            _context.next = 29;
            return (0, _mkdirpThen2.default)((0, _path.join)(outDir, '_next', 'webpack'));

          case 29:
            _context.next = 31;
            return (0, _recursiveCopy2.default)((0, _path.join)(nextDir, 'chunks'), (0, _path.join)(outDir, '_next', 'webpack', 'chunks'));

          case 31:
            _context.next = 33;
            return copyPages(nextDir, outDir, buildId);

          case 33:

            // Get the exportPathMap from the `next.config.js`
            if (typeof nextConfig.exportPathMap !== 'function') {
              (0, _utils2.printAndExit)('> Could not find "exportPathMap" function inside "next.config.js"\n' + '> "next export" uses that function to build html pages.');
            }

            _context.next = 36;
            return nextConfig.exportPathMap();

          case 36:
            exportPathMap = _context.sent;
            exportPaths = (0, _keys2.default)(exportPathMap);

            // Start the rendering process

            renderOpts = {
              dir: dir,
              dist: nextConfig.distDir,
              buildStats: buildStats,
              buildId: buildId,
              nextExport: true,
              assetPrefix: nextConfig.assetPrefix.replace(/\/$/, ''),
              dev: false,
              staticMarkup: false,
              hotReloader: null,
              availableChunks: (0, _utils.getAvailableChunks)(dir, nextConfig.distDir)

              // Allow configuration from next.config.js to be passed to the server / client
            };
            if (nextConfig.runtimeConfig) {
              // Initialize next/config with the environment configuration
              envConfig.setConfig(nextConfig.runtimeConfig);

              // Only the `public` key is exposed to the client side
              // It'll be rendered as part of __NEXT_DATA__ on the client side
              if (nextConfig.runtimeConfig.public) {
                renderOpts.runtimeConfig = {
                  public: nextConfig.runtimeConfig.public
                };
              }
            }

            // set the assetPrefix to use for 'next/asset'
            (0, _asset.setAssetPrefix)(renderOpts.assetPrefix);

            // We need this for server rendering the Link component.
            global.__NEXT_DATA__ = {
              nextExport: true
            };

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 45;
            _iterator = (0, _getIterator3.default)(exportPaths);

          case 47:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 68;
              break;
            }

            path = _step.value;

            log('  exporting path: ' + path);

            if (path.startsWith('/')) {
              _context.next = 52;
              break;
            }

            throw new Error('path "' + path + '" doesn\'t start with a backslash');

          case 52:
            _exportPathMap$path = exportPathMap[path], page = _exportPathMap$path.page, _exportPathMap$path$q = _exportPathMap$path.query, query = _exportPathMap$path$q === undefined ? {} : _exportPathMap$path$q;
            req = { url: path };
            res = {};
            htmlFilename = '' + path + _path.sep + 'index.html';

            if ((0, _path.extname)(path) !== '') {
              // If the path has an extension, use that as the filename instead
              htmlFilename = path;
            } else if (path === '/') {
              // If the path is the root, just use index.html
              htmlFilename = 'index.html';
            }
            baseDir = (0, _path.join)(outDir, (0, _path.dirname)(htmlFilename));
            htmlFilepath = (0, _path.join)(outDir, htmlFilename);
            _context.next = 61;
            return (0, _mkdirpThen2.default)(baseDir);

          case 61:
            _context.next = 63;
            return (0, _render.renderToHTML)(req, res, page, query, renderOpts);

          case 63:
            html = _context.sent;

            (0, _fs.writeFileSync)(htmlFilepath, html, 'utf8');

          case 65:
            _iteratorNormalCompletion = true;
            _context.next = 47;
            break;

          case 68:
            _context.next = 74;
            break;

          case 70:
            _context.prev = 70;
            _context.t0 = _context['catch'](45);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 74:
            _context.prev = 74;
            _context.prev = 75;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 77:
            _context.prev = 77;

            if (!_didIteratorError) {
              _context.next = 80;
              break;
            }

            throw _iteratorError;

          case 80:
            return _context.finish(77);

          case 81:
            return _context.finish(74);

          case 82:

            // Add an empty line to the console for the better readability.
            log('');

          case 83:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[45, 70, 74, 82], [75,, 77, 81]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

function copyPages(nextDir, outDir, buildId) {
  // TODO: do some proper error handling
  return new _promise2.default(function (resolve, reject) {
    var nextBundlesDir = (0, _path.join)(nextDir, 'bundles', 'pages');
    var walker = _walk2.default.walk(nextBundlesDir, { followLinks: false });

    walker.on('file', function (root, stat, next) {
      var filename = stat.name;
      var fullFilePath = '' + root + _path.sep + filename;
      var relativeFilePath = fullFilePath.replace(nextBundlesDir, '');

      // We should not expose this page to the client side since
      // it has no use in the client side.
      if (relativeFilePath === _path.sep + '_document.js') {
        next();
        return;
      }

      var destFilePath = null;
      if (relativeFilePath === _path.sep + 'index.js') {
        destFilePath = (0, _path.join)(outDir, '_next', buildId, 'page', relativeFilePath);
      } else if (/index\.js$/.test(filename)) {
        var newRelativeFilePath = relativeFilePath.replace(_path.sep + 'index.js', '.js');
        destFilePath = (0, _path.join)(outDir, '_next', buildId, 'page', newRelativeFilePath);
      } else {
        destFilePath = (0, _path.join)(outDir, '_next', buildId, 'page', relativeFilePath);
      }

      (0, _recursiveCopy2.default)(fullFilePath, destFilePath).then(next).catch(reject);
    });

    walker.on('end', resolve);
  });
}