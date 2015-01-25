var bm = require('../bookmarkletify')
var str = require('string-to-stream')
var concat = require('concat-stream')

str('alert( window.location    )')
  .pipe(bm())
  .pipe(concat({encoding: 'string'}, function (res) {
    console.log('async', res)
  }))

console.log(' sync', bm.sync('alert( window.location    )'))