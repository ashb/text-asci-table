
// Be portable
var splice = ([]).splice;

/**
 *  class AsciiTable
 *
 *  Class to display "nicely" formatted ascii-art tables of data which handles
 *  simple word wrapping and is aware of ANSI color escape codes.
 **/

/**
 *  new AsciiTable(column...)
 *  - column (Integer | Array): solumn specifications.
 *
 *  Create a new ascii table for the specified columns. Unnamed columns are
 *  passed in as just a column width. Named columns are specified as an array
 *  of `[width, title]`.
 *
 *  For example, to create a two column table:
 *
 *      new AsciiTable( 10, [ 20, "Title goes here" ] );
 **/
var AsciiTable = exports.AsciiTable = function AsciiTable() {
  var opts, 
      i, 
      to = arguments.length,
      width,
      name;

  if ( Object.prototype.toString.call( arguments[ to - 1 ] ) == "[object Object]" ) {
    to--;
    opts = arguments[ to ];
  }

  this.columns = [ ];
  this.rows = [];

  for (i=0; i < to; i++) {
    var a = arguments[ i ];

    if ( typeof a == "object" && "length" in a ) {
      // Array-ish
      width = Number( a[0] );
      name = String( a[1] );
    }
    else
      width = Number( a );

    // Intify and min-width
    width = parseInt( width );
    if ( width < 2 ) width = 2;

    this.columns.push( { width: width, title: name } );
  }
};

var p = AsciiTable.prototype;

AsciiTable.VERSION = "0.1.0";

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

/**
 *  AsciiTable#row(cell...) -> AsciiTable
 *  - cell (?): Value for the cell
 *
 *  Append a new row to the table. Each argument to this function is the cell
 *  value, and extras are ignored.
 *
 *  Returns `this` for chaining.
 **/
p.row = function row() {
  this.rows.push( splice.call(arguments, 0, this.columns.length ) );
  return this;
}

/**
 *  AsciiTable#hr() -> AsciiTable
 *
 *  Append a horizontal separator to the output.
 *
 *  Returns `this` for chaining.
 **/
p.hr = function hr() {
  this.rows.push("hr");
  return this;
}

AsciiTable.repeat = function( s, len ) {
  // Quadratic growth, then substr to right length. a bit wasteful, but eh.
  while ( s.length < len ) s += s;

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
 *  If you wish to change the wrapping behaviour, this is the function you need
 *  to override: it will be called once per cell during drawing.
 *
 *  Returns an array of wrapped-strings - each array element is a line in the
 *  cell.
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

/**
 *  AsciiTable#draw() -> String
 *
 *  Turn the table into a string. Can be called multiple times. If you wish to
 *  reuse a table for different row data, call [[AsciiTable#reset()]]
 **/
p.draw = function draw() {
  var columns = this.columns,
      n_cols = columns.length,
      output = "",
      self = this;

  if ( n_cols == 0 ) return output;

  function make_hr( type ) {
    for( var i = 0; i < n_cols; i++ ) {
      var text = AsciiTable.repeat( AsciiTable[type + "_BORDER"], columns[ i ].width );

      if ( i == 0 && n_cols == 1 )
        output += AsciiTable[type + "_LEFT"] + text + AsciiTable[type + "_RIGHT" ];
      else if ( i == 0 )
        output += AsciiTable[type + "_LEFT"] + text + AsciiTable[type + "_SEPARATOR" ];
      else if ( i == n_cols-1 )
        output += text + AsciiTable[type + "_RIGHT" ];
      else
        output += text + AsciiTable[type + "_SEPARATOR" ];
    }
    output += "\n";
  }

  function output_cells( row ) {
    var max = 0;
    var wrapped = [];
    for( var i = 0; i < n_cols; i++ ) {
      wrapped[i] = self.wrap( String( row[i] ), columns[i].width );
      max = Math.max(max, wrapped[i].length );
    }
    for( var r = 0; r < max; r++ ) {
      for( var i = 0; i < n_cols; i++ ) {
        var text = wrapped[i][r];

        if (text === (void 0)) text = "";

        // Padd to width
        text += AsciiTable.repeat(" ", columns[i].width - text.length );

        if ( i == 0 && n_cols == 1 )
          output += AsciiTable["LEFT_BORDER"] + text + AsciiTable["RIGHT_BORDER"];
        else if ( i == 0 )
          output += AsciiTable["LEFT_BORDER"] + text + AsciiTable["SEPARATOR"];
        else if ( i == n_cols-1 )
          output += text + AsciiTable["RIGHT_BORDER" ];
        else
          output += text + AsciiTable["SEPARATOR" ];
      }
      output += "\n";
    }
  }

  var cells = [];

  // Top-border
  make_hr("TOP");

  var have_any_titles = false;
  for( var i = 0; i < n_cols; i++ ) {
    if ( columns[i].title === (void 0) )
      cells[i] = [""];
    else {
      have_any_titles = true;
      cells[i] = columns[i].title;
    }
  }
  if (have_any_titles) {
    output_cells( cells );
    make_hr("HR")
  }

  for ( var i = 0; i < this.rows.length; i++ ) {
    var row = this.rows[i];
    if ( row === "hr" )
      make_hr("HR")
    else
      output_cells( row );
  }

  make_hr("BOTTOM");
  return output;
}

/**
 *  AsciiTable#reset() -> AsciiTable
 *
 *  Clears the row data so that the same column layout can be reused.
 *
 *  Returns `this` for chaining.
 **/
p.reset = function() {
  this.rows = [];
  return this;
}
