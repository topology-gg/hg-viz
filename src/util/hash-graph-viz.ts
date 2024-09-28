import * as dagreD3 from "dagre-d3";
import * as d3 from "d3";

export function createGraph() {
    new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(function () { return {}; });
}

export function addVertex(graph: dagreD3.graphlib.Graph, label: string): dagreD3.graphlib.Graph {
    graph.setNode(label, { label: label, style: "fill: none; stroke: black;", shape: "circle" });
    return graph;
}

export function addEdge(graph: dagreD3.graphlib.Graph, edge1: string, edge2: string): dagreD3.graphlib.Graph {
    graph.setEdge(edge1, edge2, { style: "stroke: black; fill: none;", curve: d3.curveLinear });
    return graph;
}

export function renderGraph(graph: dagreD3.graphlib.Graph) {
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
            zoom.transform,
            d3.zoomIdentity.translate(xCenterOffset, yCenterOffset)
        );
    }, 0);
}