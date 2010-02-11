var asserts = require('test').asserts,
    wrap = require('text-ascii-table').AsciiTable.prototype.wrap; 

exports.test_wrap_plain_text = function() {
  asserts.same( 
    wrap("abcdefghi", 3),
    ['ab-', 'cd-', 'ef-', 'ghi'],
    "Plain text wrapping ok");
}


exports.test_wrap_coloured_text = function() {
  asserts.same( 
    wrap("a\x1b[33mbc\x1b[31mdefg\x1b[0mhi", 3),
    [ 'a\x1b[33mb\x1b[0m-',
      '\x1b[33mc\x1b[31md\x1b[0m-',
      '\x1b[31mef\x1b[0m-',
      '\x1b[31mg\x1b[0mhi'
    ],
    "Plain text wrapping ok");

  asserts.same( 
    wrap("a\x1b[33mbc", 3),
    [ 'a\x1b[33mbc\x1b[0m' ],
    "Colour reset");
}


if (require.main === module)
  require('test').runner(exports);
