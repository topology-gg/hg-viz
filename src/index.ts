import * as dagreD3 from "dagre-d3";
import * as d3 from "d3";

var g = new dagreD3.graphlib.Graph()
    .setGraph({})
    .setDefaultEdgeLabel(function () { return {}; });

g.setNode("0", { label: "0", shape: "circle" });
g.setNode("1", { label: "1", shape: "circle" });
g.setNode("2", { label: "2", shape: "circle" });

g.setEdge("0", "1");
g.setEdge("0", "2");

let render = new dagreD3.render();

let svg = d3.select("svg"),
 svgGroup = svg.select("g");

render(svgGroup, g);



