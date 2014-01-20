
// Define the windmill namespace
var windmill = windmill || {};

// Define the layout submodule
windmill.layout = windmill.layout || {};

windmill.layout.matrix = function() {
    'use strict';

    // Column and Row accessors
    var col = function(d) { return d.column; },
        row = function(d) { return d.row; },
        value = function(d) { return d.value; };

    function layout(plainData) {

        var grouped = d3.map();







        return grouped;
    }

    // Accessor Methods

    layout.row = function(rowAccessor) {
        if (!arguments.length) { return row; }
        row = rowAccessor;
        return layout;
    };

    layout.column = function(colAccessor) {
        if (!arguments.length) { return col; }
        col = colAccessor;
        return layout;
    };

    layout.value = function(valueAccessor) {
        if (!arguments.length) { return value; }
        value = valueAccessor;
        return layout;
    };

    return layout;
};
