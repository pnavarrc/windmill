
// Import the required modules
var vows = require("vows"),
    assert = require("assert"),
    d3 = require("d3");

// Import the charting library
var windmill = require("../windmill");

// Create the test suite
var suite = vows.describe("windmill.chart.heatMap");

// Create a sample data array
var data = [[2, 1, 3], [4, 2, 8]],
    nRect = 6;

// Create a batch
suite.addBatch({
    "the default chart svg": {

        topic: function() {
            // Create the chart instance and a sample data array
            var chart = windmill.chart.heatMap();

            // Invoke the chart passing the container div
            d3.select("body").append("div")
                .attr("id", "default")
                .data([data])
                .call(chart);

            // Return the svg element for testing
            return d3.select("div#default").select("svg");
        },

        "exists": function(svg) {
            assert.equal(svg.empty(), false);
        },
        "is 100px wide": function(svg) {
            assert.equal(svg.attr('width'), '100');
        },
        "is 100px high": function(svg) {
            assert.equal(svg.attr('height'), '100');
        },
        "has a group": function(svg) {
            assert.equal(svg.select("g").empty(), false);
        },
        "the group has rectangles": function(svg) {
            var rect = svg.select('g').selectAll("rect");
            assert.equal(rect[0].length, nRect);
        }
    }
});

suite.export(module);