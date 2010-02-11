
var AsciiTable = exports.AsciiTable = function AsciiTable() {
  var opts, 
      i, 
      to = arguments.length,
      width,
      name;

  if ( typeof arguments[ to - 1 ] == "object" ) {
    to--;
    opts = arguments[ to ];
  }

  this.columns = [ ];

  for (i=0; i < to; i++) {
    var a = arguments[ i ];

    if ( "length" in a ) {
      // Array ish
      width = Number( a[0] );
      name = String( a[0] );
    }
    else
      width = Number( a[0] );

    // Intify and min-width
    width = parseInt( width );
    if ( width < 2 ) width = 2;

    this.columns.push( { width: width, title: name } );
  }
};

var p = AsciiTable.prototype;

AsciiTable.TOP_LEFT = '.-';
AsciiTable.TOP_BORDER = '-';
AsciiTable.TOP_SEPARATOR = '-+-';
AsciiTable.TOP_RIGHT = '-.';

AsciiTable.HR_LEFT = '+-';
AsciiTable.HR_BORDER = '-';
AsciiTable.HR_SEPARATOR = '-+-';
AsciiTable.HR_RIGHT = '-+';

AsciiTable.LEFT_BORDER = '| ';
AsciiTable.SEPARATOR = ' | ';
AsciiTable.RIGHT_BORDER = ' |';

AsciiTable.BOTTOM_LEFT = "'-";
AsciiTable.BOTTOM_BORDER = '-';
AsciiTable.BOTTOM_SEPARATOR = '-+-';
AsciiTable.BOTTOM_RIGHT = "-'";

AsciiTable.WRAP = '-';

AsciiTable.repeat = function( s, len ) {
  // Quadratic growth, then substr to right length. a bit wasteful, but eh.
  while ( s.length < s ) s += s;

  return s.substr( 0, len );
}

/**
 *  AsciiTable#wrap( text, width ) -> Array
 *  - text (String): text to wrap
 *  - width (Number): number of chars to wrap at.
 *
 *  Wraps `text` into multiple lines so it will fit into a table cell. This
 *  method is ANSI colour-escape aware -- i.e. ansi colour escape sequences
 *  will be correctly wrapped and the colour will be reset between each row.
 *
 *  Returns an array of wrapped-strings
 **/
p.wrap = function wrap( text, width ) {
  var lines = text.split("\n"),
      out = [],
      // To start with, there is no colour, and nothing needed to reset it.
      cur_colour = "",
      colour_reset = "";

  for ( var i = 0; i < lines.length; i++ ) {
    var l = lines[ i ],
        out_l = "",
        visible = 0,
        m,
        re = new RegExp("((?:(?:\x1b\\[[^m]*?m)?.){1," + width + "}$)" + "|" +
                        "((?:(\x1b\\[[^m]*?m)?.){1," + (width - AsciiTable.WRAP.length) + "})", "g");

    while ( ( m = re.exec( l ) ) != null ) {
      if ( m[1] ) {
        // Terminal case
        // Is the reset code the last colour change.
        out_l = cur_colour + m[1];
        m = m[1].match( /(\x1B\[[^m]*?m)(?:(?!\x1B\[[^m]*?m).)*$/);

        if (m && m[1] != colour_reset) out_l += "\x1b[0m";
        out.push( out_l );
      }
      else {
        out_l = cur_colour + m[2];
        if ( m[3] == "\x1b[0m" ) {
          cur_colour = "";
          colour_reset = "";
        }
        else if ( m[3] ) {
          cur_colour = m[3];
          colour_reset = "\x1b[0m";
        }
        out_l += colour_reset + AsciiTable.WRAP;
        out.push(out_l);
      }
    }
  }

  return out;
}

p.draw = function draw() {
  var columns = this.columns,
      n_cols = columns.length,
      output = "";

  if ( n_cols == 0 ) return output;

  function make_hr( type ) {
    for( var i = 0; i < n_cols; i++ ) {
      var text = AsciiTable.repeat( AsciiTable[type + "_BORDER"], columns[ i ].width );

      if ( i == 0 && n_cols == 1 )
        output += AsciiTable[type + "_LEFT"] + text + AsciiTable[type + "_RIGHT" ];
      else if ( i == 0 )
        output += AsciiTable[type + "_LEFT"] + text + AsciiTable[type + "_SEPARATOR" ];
      else if ( i == n_cols )
        output += text + AsciiTable[type + "_RIGHT" ];
      else
        output += text + AsciiTable[type + "_SEPARATOR" ];
    }
    output += "\n";
  }
http://uk.old.finance.yahoo.com/d/quotes.csv?s=GE&f=sl1d1t1c1ohgv&e=.csv
  var cells = [];

  // Top-border
  make_hr("TOP");
  return output;
}
