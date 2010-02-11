var asserts = require('test').asserts,
    AsciiTable = require('text-ascii-table').AsciiTable; 

exports.test_no_titles = function() {
  var table = new AsciiTable( 5, 10 );
  table.row( 'Catalyst', 'rockz!' )
       .row( 'DBIx::Class', 'suckz!' )
       .row( 'Template::Toolkit', 'rockz!');

  asserts.same( 
    table.draw(),
".-------+------------.\n\
| Cata- | rockz!     |\n\
| lyst  |            |\n\
| DBIx- | suckz!     |\n\
| ::Cl- |            |\n\
| ass   |            |\n\
| Temp- | rockz!     |\n\
| late- |            |\n\
| ::To- |            |\n\
| olkit |            |\n\
'-------+------------'\n",
    "table ok");
}

exports.test_titles = function() {
  var table = new AsciiTable( [5, "ROCKZ!"], [10,  "Suckz!"], [7, "rockz!"] );
  table.row('Catalyst', 'DBIx::Class', 'Template::Toolkit', 'HTML::Mason');

  asserts.same( 
    table.draw(),
".-------+------------+---------.\n\
| ROCK- | Suckz!     | rockz!  |\n\
| Z!    |            |         |\n\
+-------+------------+---------+\n\
| Cata- | DBIx::Cla- | Templa- |\n\
| lyst  | ss         | te::To- |\n\
|       |            | olkit   |\n\
'-------+------------+---------'\n",
    "table ok");
}


exports.test_minimal = function() {
  var table = new AsciiTable( 5 );
  table.row('Everything works!');

  asserts.same( 
    table.draw(),
".-------.\n\
| Ever- |\n\
| ythi- |\n\
| ng w- |\n\
| orks! |\n\
'-------'\n",
    "table ok");
}

exports.test_hr = function() {
  var table = new AsciiTable( 5 );
  table.row('Everything works!')
       .hr()
       .row('Everything works!');

  asserts.same( 
    table.draw(),
".-------.\n\
| Ever- |\n\
| ythi- |\n\
| ng w- |\n\
| orks! |\n\
+-------+\n\
| Ever- |\n\
| ythi- |\n\
| ng w- |\n\
| orks! |\n\
'-------'\n",
    "table ok");
}


exports.test_bad_width = function() {
  var table = new AsciiTable( 1 );
  table.row('Works!')
       .hr()
       .row('Works!');

  asserts.same( 
    table.draw(),
".----.\n\
| W- |\n\
| o- |\n\
| r- |\n\
| k- |\n\
| s! |\n\
+----+\n\
| W- |\n\
| o- |\n\
| r- |\n\
| k- |\n\
| s! |\n\
'----'\n",
    "table ok");
}

if (require.main === module)
  require('test').runner(exports);

