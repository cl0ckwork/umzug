'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

var _Storage = require('./Storage');

var _Storage2 = _interopRequireDefault(_Storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class JSONStorage
 */
class JSONStorage extends _Storage2.default {
  /**
   * Constructs JSON file storage.
   *
   * @param {Object} [options]
   * @param {String} [options.path='./umzug.json'] - Path to JSON file where
   * the log is stored. Defaults './umzug.json' relative to process' cwd.
   */
  constructor({ path = _path3.default.resolve(process.cwd(), 'umzug.json') } = {}) {
    super();
    this.path = path;
  }

  /**
   * Logs migration to be considered as executed.
   *
   * @param {String} migrationName - Name of the migration to be logged.
   * @returns {Promise}
   */
  logMigration(migrationName) {
    const filePath = this.path;
    const readfile = _bluebird2.default.promisify(_fs2.default.readFile);
    const writefile = _bluebird2.default.promisify(_fs2.default.writeFile);

    return readfile(filePath).catch(() => '[]').then(content => JSON.parse(content)).then(content => {
      content.push(migrationName);
      return writefile(filePath, (0, _stringify2.default)(content, null, '  '));
    });
  }

  /**
   * Unlogs migration to be considered as pending.
   *
   * @param {String} migrationName - Name of the migration to be unlogged.
   * @returns {Promise}
   */
  unlogMigration(migrationName) {
    const filePath = this.path;
    const readfile = _bluebird2.default.promisify(_fs2.default.readFile);
    const writefile = _bluebird2.default.promisify(_fs2.default.writeFile);

    return readfile(filePath).catch(() => '[]').then(content => JSON.parse(content)).then(content => {
      content = content.filter(m => m !== migrationName);
      return writefile(filePath, (0, _stringify2.default)(content, null, '  '));
    });
  }

  /**
   * Gets list of executed migrations.
   *
   * @returns {Promise.<String[]>}
   */
  executed() {
    const filePath = this.path;
    const readfile = _bluebird2.default.promisify(_fs2.default.readFile);

    return readfile(filePath).catch(() => '[]').then(content => JSON.parse(content));
  }
}
exports.default = JSONStorage;