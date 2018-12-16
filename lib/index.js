
var debug = require('debug')('metalsmith-excerpts');
var extname = require('path').extname;
var cheerio = require('cheerio');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * A Metalsmith plugin to extract an excerpt from Markdown files.
 *
 * @param {Object} options
 * @return {Function}
 */

function plugin(options){
  return function(files, metalsmith, done){
    setImmediate(done);
    Object.keys(files).forEach(function(file){
      debug('checking file: %s', file);
      if (!html(file)) return;
      var data = files[file];

      if (typeof data.excerpt === 'string' && data.excerpt.length) {
        return; // don't mutate data
      }

      debug('storing excerpt: %s', file);
      var $ = cheerio.load(data.contents.toString());
      var p = $('p').first();
      data.excerpt = $.html(p).trim();
      if (data.excerpt.indexOf("img") != -1) {
        var paths = data.path.split("\\");
        paths.pop();
        var path = paths.join("/");      
        data.excerpt = data.excerpt.replace("src=\"", "src=\"/" + path + "/");
        data.excerpt = data.excerpt.replace("href=\"", "href=\"/" + path + "/");
      }
    });
  };
}

/**
 * Check if a `file` is markdown.
 *
 * @param {String} file
 * @return {Boolean}
 */

function html(file){
  return /\.html?/.test(extname(file));
}

