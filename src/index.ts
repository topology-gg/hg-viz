import { TopologyNode } from "@topology-foundation/node";
import type { TopologyObject } from "@topology-foundation/object";
import { ColorCRO } from "./objects/color";

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

	const object_element = <HTMLDivElement>(
		document.getElementById("object_peers")
	);
	object_element.innerHTML = `[${objectPeers.join(", ")}]`;
	(<HTMLSpanElement>document.getElementById("colorId")).innerText =
		topologyObject?.id;


	if(!colorCRO) return;
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

	const hash_graph = topologyObject.hashGraph;
	console.log(hash_graph);
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
		colorCRO.paint("red");
		render();
	});

	const button_paint_green = <HTMLButtonElement>document.getElementById("paintGreen");
	button_paint_green.addEventListener("click", () => {
		colorCRO.paint("green");
		render();
	});

	const button_paint_blue = <HTMLButtonElement>document.getElementById("paintBlue");
	button_paint_blue.addEventListener("click", () => {
		colorCRO.paint("blue");
		render();
	});

}

main();