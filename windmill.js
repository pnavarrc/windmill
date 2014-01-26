!function () {
    var windmill = {version: '0.1.1'}; // semver


windmill.svg = {};
/* globals windmill */

// SVG Translation
windmill.svg.translate = function(dx, dy) {
    return 'translate(' + [dx, dy] + ')';
};

// SVG Scale
windmill.svg.scale = function(sx, sy) {
    if (arguments.length < 2) { sy = sx; }
    return 'scale(' + [sx, sy] + ')';
};
// Charts
windmill.chart = {};
// HeatMap Chart
windmill.chart.heatmap = function() {
    'use strict';

    // Default Attributes
    var attributes = {
        width: 600,
        height: 300,
        margin: {top: 20, right: 20, bottom: 40, left: 40},
        colorExtent: ['#000', '#aaa'],
        value: function(d) { return d.value; },
        row: function(d) { return d.row; },
        column: function(d) { return d.column; }
    };

    // Charting function
    function chart(selection) {
        selection.each(function(data) {

            var div = d3.select(this),
                svg = div.selectAll('svg').data([data])
                    .enter()
                    .append('svg')
                    .call(chart.svgInit);

            var margin = chart.margin(),
                width = chart.width() - margin.left - margin.right,
                height = chart.height() - margin.top - margin.bottom;

            // Accessor functions
            var row = chart.row(),
                col = chart.column(),
                val = chart.value();

            var gchart = svg.select('g.chart');

            var xScale = d3.scale.ordinal()
                .domain(data.map(col))
                .rangeBands([0, width]);

            var yScale = d3.scale.ordinal()
                .domain(data.map(row))
                .rangeBands([0, height]);

            var cScale = d3.scale.linear()
                .domain(d3.extent(data, val))
                .range(chart.colorExtent());

            var rect = gchart.selectAll('rect')
                .data(data)
                .enter()
                .append('rect');

            rect
                .attr('width', xScale.rangeBand())
                .attr('height', yScale.rangeBand())
                .attr('x', function(d) { return xScale(col(d)); })
                .attr('y', function(d) { return yScale(row(d)); })
                .attr('fill', function(d) { return cScale(val(d)); });

            // X Axis
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');

            svg.select('g.xaxis').call(xAxis);

            // Y Axis
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left');

            svg.select('g.yaxis').call(yAxis);


        });
    }

    chart.svgInit = function(svg) {

        var margin = chart.margin(),
            width = chart.width() - margin.left - margin.right,
            height = chart.height() - margin.top - margin.bottom,
            translate = windmill.svg.translate;

        // Set the size of the svg element
        svg
            .attr('width', chart.width())
            .attr('height', chart.height());

        // Chart Container
        svg.append('g').attr('class', 'chart')
            .attr('transform', translate(margin.left, margin.top));

        // X Axis Container
        svg.append('g').attr('class', 'axis xaxis')
            .attr('transform', translate(margin.left, margin.top + height));

        // Y Axis Container
        svg.append('g').attr('class', 'axis yaxis')
            .attr('transform', translate(margin.left, margin.top));
    };

    // Generate the Accessor Function for the given attribute
    function createAccessor(attr) {
        function accessor(value) {
            if (!arguments.length) { return attributes[attr]; }
            attributes[attr] = value;
            return chart;
        }
        return accessor;
    }

    // Create the accessor methods
    for (var attr in attributes) {
        if ((!chart[attr]) && (attributes.hasOwnProperty(attr))) {
            chart[attr] = createAccessor(attr);
        }
    }

    return chart;
};


// Heatmap Chart
windmill.chart.heatMap2 = function() {
    'use strict';

    // Default Chart Attributes
    var width = 100,
        height = 100,
        margin = {top: 20, right: 20, bottom: 40, left: 40};

    // Default Color Extent
    var colorExtent = ['#000', '#aaa'];

    // Data Accessors
    var value = function(d) { return d.value; };

    // Charting function
    function chart(selection) {
        selection.each(function(data) {

            // Select the container div and append the svg element
            var div = d3.select(this),
                svg = div.selectAll('svg')
                    .data([data])
                    .enter()
                    .append('svg')
                    .call(chart.svgInit);

            // Compute the number of rows and columns, and the size
            // of the charting area
            var nrows = data.length,
                ncols = data[0].length,
                w = width - margin.left - margin.right,
                h = height - margin.top - margin.bottom;

            // Compute the x scale
            var xScale = d3.scale.ordinal()
                .domain(d3.range(ncols))
                .rangeBands([0, w]);

            // Compute the y scale
            var yScale = d3.scale.ordinal()
                .domain(d3.range(nrows))
                .rangeBands([0, h]);

            // Flatten the array to compute the extent
            var flat = data.reduce(function(prev, current) {
                    return prev.concat(current);
                });

            // Compute the extent of values
            var valueExtent = d3.extent(flat, value);

            // Create the color scale
            var colorScale = d3.scale.linear()
                .domain(valueExtent)
                .range(colorExtent);

            // Select the container group for the chart
            var g = svg.select('g.chart');

            // Create a group for each row and translate it
            var gRows = g.selectAll('g')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'row')
                .attr('transform', function(d, i) {
                    return windmill.svg.translate(0, yScale(i));
                });

            // Create the heatmap rectangles
            gRows.selectAll('rect')
                .data(function(d) { return d; })
                .enter()
                .append('rect')
                .attr('x', function(d, i) { return xScale(i); })
                .attr('width', xScale.rangeBand())
                .attr('height', yScale.rangeBand())
                .attr('fill', function(d) { return colorScale(value(d)); });
        });
    }

    // Initialize the svg element
    chart.svgInit = function(selection) {

        // Set the width and height of the svg element
        var svg = selection
            .attr('width', width)
            .attr('height', height);

        // Append an element for the chart group
        svg.append('g')
            .attr('class', 'chart')
            .attr('transform', function() {
                return windmill.svg.translate(margin.left, margin.top);
            });
    };

    // Accessor Methods
    // ----------------

    // Value Accessor
    chart.value = function(valueAccessor) {
        if (!arguments.length) { return value; }
        value = valueAccessor;
        return chart;
    };

    chart.colorExtent = function(colorExt) {
        if (!arguments.length) { return colorExtent; }
        colorExtent = colorExt;
        return chart;
    };

    // Width Accessor
    chart.width = function(w) {
        if (!arguments.length) { return width; }
        width = w;
        return chart;
    };

    // Height Accessor
    chart.height = function(h) {
        if (!arguments.length) { return height; }
        height = h;
        return chart;
    };

    // Margin Accessor
    chart.margin = function(m) {
        if (!arguments.length) { return margin; }
        margin = m;
        return chart;
    };

    return chart;
};
// Layouts
windmill.layout = {};
// Group Layouts
windmill.layout.matrix = function() {
    'use strict';

    // Default Accessor Functions
    var properties = {
        row: function(d) { return d.row; },
        column: function(d) { return d.column; },
        value: function(d) { return d.value; },
        aggregate: function(values) {
            return values.reduce(function(prev, curr) { return prev + curr; }, 0);
        }
    };

    function layout(data) {

        var mapData = [],
            groupedData = [];

        var row, col, val,
            found = false;

        // Group the items by row and column
        data.forEach(function(d) {

            // Compute the row, column and value for each data item
            row = properties.row(d);
            col = properties.column(d);
            val = properties.value(d);

            // Search the grouped array to find the item with the
            // row and column
            found = false;
            groupedData.forEach(function(item, idx) {
                if ((item.row === row) && (item.col === col)) {
                    groupedData[idx].values.push(val);
                    found = true;
                }
            });

            // Append the item, if not found
            if (!found) {
                groupedData.push({row: row, col: col, values: [val]});
            }
        });

        // Reduce
        groupedData.forEach(function(d) {
            d.value = properties.aggregate(d.values);
        });

        return groupedData;
    }


    function createAccessor(attr) {
        function accessor(value) {
            if (!arguments.length) { return properties[attr]; }
            properties[attr] = value;
            return layout;
        }
        return accessor;
    }

    layout.generateProperties = function() {
        for (var attr in properties) {
            if ((!layout[attr]) && (properties.hasOwnProperty(attr))) {
                layout[attr] = createAccessor(attr);
            }
        }
    };

    layout.generateProperties();
    return layout;
};


    // Expose the package components
    if (typeof module === 'object' && module.exports) {
        // The package is loaded as a node module
        this.d3 = require('d3');
        module.exports = windmill;
    } else {
        // The file is loaded in the browser.
        this.windmill = windmill;
    }
}();