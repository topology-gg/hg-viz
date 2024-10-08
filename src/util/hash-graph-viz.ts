import * as dagreD3 from "dagre-d3";
import * as d3 from "d3";

let lastVertexPosition = { x: 0, y: 0 };

export function createGraph(): dagreD3.graphlib.Graph {
    return new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(function () { return {}; });
}

export function addVertex(graph: dagreD3.graphlib.Graph, vertexName: string, color: string): void {
    console.log('addVertex,', vertexName, color);
    if (!graph.hasNode(vertexName)) {
        graph.setNode(vertexName, { label: '', labelType: 'text', style: `fill: ${color}; stroke: black;`, shape: "circle" });
        lastVertexPosition = graph.node(vertexName);
    }
}

export function addEdge(graph: dagreD3.graphlib.Graph, fromVertexName: string, toVertexName: string): void {
    graph.setEdge(fromVertexName, toVertexName, { labelType: 'text', style: "stroke: black; fill: none;", curve: d3.curveLinear });
}

export function renderGraph(graph: dagreD3.graphlib.Graph) {
    const renderer = new dagreD3.render();
    const svg = d3.select("#dag-svg");

    if (svg.empty()) {
        console.error("SVG element not found");
        return;
    }

    svg.selectAll("g").remove();
    const svgGroup = svg.append("g");
    const zoom = d3.zoom().on("zoom", (event) => {
        svgGroup.attr("transform", event.transform);
    });
    svg.call(zoom as any);

    renderer(svgGroup as any, graph as any);

    setTimeout(() => {
        const graphWidth = (graph.graph() as any).width;
        const graphHeight = (graph.graph() as any).height;
        const svgWidth = parseInt(svg.attr("width")!);
        const svgHeight = parseInt(svg.attr("height")!);
        const xCenterOffset = (svgWidth - graphWidth) / 2;
        const yCenterOffset = (svgHeight - graphHeight) / 2;

        svg.call(
            zoom.transform as any,
            d3.zoomIdentity.translate(xCenterOffset, yCenterOffset)
        );

        if (lastVertexPosition.x !== undefined && lastVertexPosition.y !== undefined) {
            const translateX = svgWidth / 2 - lastVertexPosition.x;
            const translateY = svgHeight / 2 - lastVertexPosition.y;
            svg.call(zoom.transform as any, d3.zoomIdentity.translate(translateX, translateY));
        }
    }, 0);
}