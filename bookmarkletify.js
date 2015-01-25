var urlencode = require('urlencode-stream')
var uglify = require('uglify-stream')
var wrap = require('wrap-stream')
var pumpify = require('pumpify')
var ugly = require('uglify-js')

var prefix = 'javascript:(function(){;'
var suffix = ';})()'

// minify -> url encode -> wrap in a bookmarklet
module.exports = function () {
  var pipline = pumpify(uglify(), new urlencode(), wrap(prefix, suffix))
  return pipline
}

// Same process, just sync / non-streaming
module.exports.sync = function (src) {
  var ast = ugly.parse(src)
  ast.figure_out_scope()
  ast.transform(ugly.Compressor())
  var code = ast.print_to_string()
  return prefix + encodeURI(code) + suffix
}
