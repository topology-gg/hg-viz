import { TopologyNode } from "@topology-foundation/node";
import type { TopologyObject } from "@topology-foundation/object";
import { ColorCRO } from "./objects/color";
import { createGraph, addVertex, addEdge, renderGraph } from "./util/hash-graph-viz"

const node = new TopologyNode();
let topologyObject: TopologyObject;
let colorCRO: ColorCRO;
let peers: string[] = [];
let discoveryPeers: string[] = [];
let objectPeers: string[] = [];

const render = () => {
	if (topologyObject) {
		const gridIdElement = <HTMLSpanElement>document.getElementById("gridId");
		gridIdElement.innerText = topologyObject.id;
		const copyGridIdButton = document.getElementById("copyGridId");
		if (copyGridIdButton) {
			copyGridIdButton.style.display = "inline"; // Show the button
		}
	} else {
		const copyGridIdButton = document.getElementById("copyGridId");
		if (copyGridIdButton) {
			copyGridIdButton.style.display = "none"; // Hide the button
		}
	}

	const element_peerId = <HTMLDivElement>document.getElementById("peerId");
	element_peerId.innerHTML = `<strong>${node.networkNode.peerId}</strong>`;

	const peers_element = <HTMLDivElement>document.getElementById("peers");
	peers_element.innerHTML = `[${peers.join(", ")}]`;

	const discovery_element = <HTMLDivElement>(
		document.getElementById("discovery_peers")
	);
	discovery_element.innerHTML = `[${discoveryPeers.join(", ")}]`;



	if (!colorCRO) return;
	console.log(!colorCRO);
	const paintRed = document.getElementById("paintRed");
	if (paintRed) {
		paintRed.style.display = "inline";
	}
	const paintGreen = document.getElementById("paintGreen");
	if (paintGreen) {
		paintGreen.style.display = "inline";
	}
	const paintBlue = document.getElementById("paintBlue");
	if (paintBlue) {
		paintBlue.style.display = "inline";
	}

	// Here he hashgraph is rendered

	const graph_viz = createGraph();

	const hash_graph = topologyObject.hashGraph;

	console.log(hash_graph.getAllVertices())

	// add nodes to the graph
	hash_graph.getAllVertices().forEach(vertex => {
		let colorHex = vertex.operation.value == null ? "#FFFFFF" : vertex.operation.value.toString();
		addVertex(graph_viz, vertex.hash, colorHex);
	});

	// add edges to the graph
	hash_graph.getAllVertices().forEach(vertex => {
		const dependencies = hash_graph.getDependencies(vertex.hash);
		dependencies.forEach(dependency => {
			const dependencyVertex = hash_graph.getVertex(dependency);
			if (dependencyVertex) {
				addEdge(graph_viz, vertex.hash, dependency); // Create an edge from vertex to its dependency
			}
		});
	});

	// Render the graph
	renderGraph(graph_viz);
}

async function createConnectHandlers() {
	node.addCustomGroupMessageHandler(topologyObject.id, (e) => {
		if (topologyObject)
			objectPeers = node.networkNode.getGroupPeers(topologyObject.id);
		render();
	});

	node.objectStore.subscribe(topologyObject.id, (_, _obj) => {
		render();
	});
}

async function main() {
	await node.start();
	render();

	node.addCustomGroupMessageHandler("", (e) => {
		peers = node.networkNode.getAllPeers();
		discoveryPeers = node.networkNode.getGroupPeers("topology::discovery");
		render();
	});

	const button_create = <HTMLButtonElement>(
		document.getElementById("create")
	);

	button_create.addEventListener("click", async () => {
		topologyObject = await node.createObject(new ColorCRO());
		colorCRO = topologyObject.cro as ColorCRO;
		createConnectHandlers();
		render();
	});

	const button_connect = <HTMLButtonElement>document.getElementById("connect");
	button_connect.addEventListener("click", async () => {
		const croId = (<HTMLInputElement>document.getElementById("croId"))
			.value;
		try {
			topologyObject = await node.createObject(
				new ColorCRO(),
				croId,
				undefined,
				true,
			);
			colorCRO = topologyObject.cro as ColorCRO;
			createConnectHandlers();
			render();
			console.log("Succeeded in connecting with CRO", croId);
		} catch (e) {
			console.error("Error while connecting with CRO", croId, e);
		}
	});

	const button_paint_red = <HTMLButtonElement>document.getElementById("paintRed");
	button_paint_red.addEventListener("click", () => {
		colorCRO.paint("#CC0000"); // red
		render();
	});

	const button_paint_green = <HTMLButtonElement>document.getElementById("paintGreen");
	button_paint_green.addEventListener("click", () => {
		colorCRO.paint("#006600"); // green
		render();
	});

	const button_paint_blue = <HTMLButtonElement>document.getElementById("paintBlue");
	button_paint_blue.addEventListener("click", () => {
		colorCRO.paint("#0000CC"); // blue
		render();
	});
}

main();