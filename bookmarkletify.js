var urlencode = require('urlencode-stream')
var uglify = require('uglify-stream')
var through = require('through2')
var pumpify = require('pumpify')
var ugly = require('uglify-js')

var prefix = 'javascript:(function(){;'
var suffix = ';})()'

module.exports = function () {
  function pre (chunk, enc, cb) {
    var first = true
    if (first) {
      first = false
      cb(null, prefix + chunk)
    } else {
      cb(null, chunk)
    }
  }

  function post (cb) {
    this.push(suffix)
    cb()
  }

  var pipline = pumpify(uglify(), new urlencode(), through(pre, post))
  return pipline
}

module.exports.sync = function (src) {
  var ast = ugly.parse(src)
  ast.figure_out_scope()
  ast.transform(ugly.Compressor())
  var code = ast.print_to_string()
  return prefix + encodeURI(code) + suffix
}
