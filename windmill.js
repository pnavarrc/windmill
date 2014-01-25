!function () {
    var windmill = {version: '0.1.0'}; // semver


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
// Heatmap Chart
windmill.chart.heatMap = function() {
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