import * as dagreD3 from "dagre-d3";
import * as d3 from "d3";

export function createGraph(): dagreD3.graphlib.Graph {
    return new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(function () { return {}; });
}

export function addVertex(graph: dagreD3.graphlib.Graph, label: string): void {
    if (!graph.hasNode(label)) {
        graph.setNode(label, { label: label, labelType: 'text', style: "fill: none; stroke: black;", shape: "circle" });
    }
}

export function addEdge(graph: dagreD3.graphlib.Graph, edge1: string, edge2: string): void {
    graph.setEdge(edge1, edge2, { labelType: 'text', style: "stroke: black; fill: none;", curve: d3.curveLinear });
}

export function renderGraph(graph: dagreD3.graphlib.Graph) {
    const renderer = new dagreD3.render();

    // Select the SVG element and create a group inside it
    var svg = d3.select("#dag-svg");

    if (svg.empty()) {
        console.error("SVG element not found");
        return;
    }

    svg.selectAll("g").remove();
    var svgGroup = svg.append("g");

    // Apply zoom behavior to the SVG
    var zoom = d3.zoom().on("zoom", (event) => {
        svgGroup.attr("transform", event.transform);
    });
    svg.call(zoom as any);

    console.log("otherside")
    console.log(graph.nodes())
    console.log(graph.edges())

    // Render the graph
    renderer(svgGroup as any, graph as any);



    // Center and resize the graph in the SVG after rendering
    setTimeout(() => {
        const graphWidth = (graph.graph() as any).width;
        const graphHeight = (graph.graph() as any).height;

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
            zoom.transform as any,
            d3.zoomIdentity.translate(xCenterOffset, yCenterOffset)
        );
    }, 0);
}