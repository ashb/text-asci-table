# text-ascii-table

Draw pretty ascii tables in JavaScript.

A picture is worth a thousand words, so here is one:

    .----------------------+--------------------------------.
    | Project              | Features                       |
    +----------------------+--------------------------------+
    | Flusspferd           | Embeddable C++, almost all of- |
    |                      |  CommonJS specs                |
    | Narwhall             | Rhino, CommonJS again, and ja- |
    |                      | va libs                        |
    | node                 | Evented, but just require fro- |
    |                      | m CommonJS                     |
    '----------------------+--------------------------------'

As you can see the text wrapping is not particularly advanced. That's because
this module was inspired by perl's [Text::SimpleTable] and I primarily plan on
using it to display tables of non-prose.

See the docs in lib/text-ascii-table.js for the API.

[Text::SimpleTable] http://search.cpan.org/perldoc?Text::SimpleTable
