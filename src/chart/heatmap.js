/* globals d3 */

var windmill = windmill || {};
windmill.chart = windmill.chart || {};

windmill.chart.heatMap = function() {

    // Chart Attributes
    var width = 100,
        height = 100,
        margin = {top: 20, right: 20, bottom: 40, left: 40};

    function chart(selection) {
        selection.each(function(data) {

            var ny = data.length,
                nx = data[0].length,
                w = width - margin.left - margin.right,
                h = height - margin.top - margin.bottom;

            var div = d3.select(this),
                svg = div.selectAll('svg')
                    .data([data])
                    .enter().append('svg')
                    .call(chart.svgInit);

            // Compute the size of each rectangle
            var xScale = d3.scale.ordinal()
                .domain(d3.range(nx))
                .rangeBands([0, w], 0.1);

            var yScale = d3.scale.ordinal()
                .domain(d3.range(ny))
                .rangeBands([0, h], 0.1);

            var minValue = d3.min(data, function(row) {
                    return d3.min(row );
                }),
                maxValue = d3.max(data, function(row) {
                    return d3.max(row);
                });

            var cScale = d3.scale.linear()
                .domain([minValue, maxValue])
                .range(['#ff0000', '#0000ff']);

            var g = svg.select('g.chart');

            var grows = g.selectAll('g')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'row')
                .attr('transform', function(d, i) {
                    return 'translate(' + [0, yScale(i)] + ')';
                });

            grows.selectAll('rect')
                .data(function(d) { return d; })
                .enter()
                .append('rect')
                .attr('x', function(d, i) { return xScale(i); })
                .attr('width', xScale.rangeBand())
                .attr('height', yScale.rangeBand())
                .attr('fill', function(d) { return cScale(d); });

        });
    }

    chart.svgInit = function(selection) {

        var svg = selection
            .attr('width', width)
            .attr('height', height);

        svg.append('g')
            .attr('class', 'chart')
            .attr('transform', 'translate(' + [margin.left, margin.top] + ')');
    };

    return chart;
};