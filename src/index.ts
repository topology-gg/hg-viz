import * as dagreD3 from "dagre-d3";
import * as d3 from "d3";

// Create the input graph
var g = new dagreD3.graphlib.Graph()
    .setGraph({})
    .setDefaultEdgeLabel(function () { return {}; });

// Define nodes and edges
g.setNode("0", { label: "0", style: "fill: none; stroke: black;", shape: "circle" });
g.setNode("1", { label: "1", style: "fill: none; stroke: black;", shape: "circle" });
g.setNode("2", { label: "2", style: "fill: none; stroke: black;", shape: "circle" });
g.setNode("3", { label: "3", style: "fill: none; stroke: black;", shape: "circle" });
g.setNode("4", { label: "4", style: "fill: none; stroke: black;", shape: "circle" });
g.setNode("5", { label: "5", style: "fill: none; stroke: black;", shape: "circle" });
g.setNode("6", { label: "6", style: "fill: none; stroke: black;", shape: "circle" });
g.setNode("7", { label: "7", style: "fill: none; stroke: black;", shape: "circle" });

g.setEdge("0", "1", { style: "stroke: black; fill: none;", curve: d3.curveLinear});
g.setEdge("0", "2", { style: "stroke: black; fill: none;", curve: d3.curveLinear});
g.setEdge("0", "3", { style: "stroke: black; fill: none;", curve: d3.curveLinear});
g.setEdge("1", "4", { style: "stroke: black; fill: none;", curve: d3.curveLinear});
g.setEdge("1", "5", { style: "stroke: black; fill: none;", curve: d3.curveLinear});
g.setEdge("2", "6", { style: "stroke: black; fill: none;", curve: d3.curveLinear});
g.setEdge("2", "5", { style: "stroke: black; fill: none;", curve: d3.curveLinear});
g.setEdge("5", "7", { style: "stroke: black; fill: none;", curve: d3.curveLinear});
g.setEdge("2", "7", { style: "stroke: black; fill: none;", curve: d3.curveLinear});

// Create the renderer
const renderer = new dagreD3.render();

// Select the SVG element and create a group inside it
var svg = d3.select<SVGSVGElement, unknown>("#dag-svg");
var svgGroup = svg.append<SVGGElement>("g");

// Apply zoom behavior to the SVG
var zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
    svgGroup.attr("transform", event.transform);
});
svg.call(zoom);

// Render the graph
renderer(svgGroup as any, g as any);

// Center and resize the graph in the SVG after rendering
setTimeout(() => {
    const graphWidth = (g.graph() as any).width;
    const graphHeight = (g.graph() as any).height;

    // Dynamically set the SVG width and height based on graph size
    svg.attr("width", graphWidth);
    svg.attr("height", Math.max(graphHeight, 200)); // Ensuring minimum height

    // Adjust zoom to fit the graph
    const svgWidth = parseInt(svg.attr("width")!);
    const svgHeight = parseInt(svg.attr("height")!);

    const xCenterOffset = (svgWidth - graphWidth) / 2;
    const yCenterOffset = (svgHeight - graphHeight) / 2;

    // Set initial transform to position and scale the graph
    svg.call(
        zoom.transform,
        d3.zoomIdentity.translate(xCenterOffset, yCenterOffset)
    );
}, 0);
