import { useCallback, useState } from "react";
import { DRPNode } from "@ts-drp/node";
import { DRPObject } from "@ts-drp/object";

import {
	ReactFlow,
	Background,
	Controls,
	MiniMap,
	addEdge,
	useNodesState,
	useEdgesState,
	type OnConnect,
	Edge,
	MarkerType,
	Panel,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";

import "@xyflow/react/dist/style.css";

import { AppNode } from "./nodes/types";
import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import { VertexNode } from "./nodes/types";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 100;

const node = new DRPNode();
await node.start();
let drpObject: DRPObject | undefined = undefined;

const getLayoutedElements = (nodes: AppNode[], edges: Edge[]) => {
	dagreGraph.setGraph({ rankdir: "BT" });

	nodes.forEach((node) => {
		dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
	});

	edges.forEach((edge) => {
		dagreGraph.setEdge(edge.source, edge.target);
	});

	dagre.layout(dagreGraph);

	const newNodes = nodes.map((node) => {
		const nodeWithPosition = dagreGraph.node(node.id);
		const newNode = {
			...node,
			/* We are shifting the dagre node position (anchor=center center) to the top left
			so it matches the React Flow node anchor point (top left). */
			position: {
				x: nodeWithPosition.x - nodeWidth / 2,
				y: nodeWithPosition.y - nodeHeight / 2,
			},
		};

		return newNode;
	});

	return { nodes: newNodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);

export default function App() {
	const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

	const onConnect: OnConnect = useCallback(
		(connection) => setEdges((edges) => addEdge(connection, edges)),
		[setEdges],
	);

	const onLayout = () => {
		const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
		setNodes(layoutedNodes);
		setEdges(layoutedEdges);
	};

	async function createConnectHandlers() {
		if (!drpObject) return;
	
		node.addCustomGroupMessageHandler(drpObject?.id, () => {});
	
		node.objectStore.subscribe(drpObject?.id, () => {
			console.log('Object updated');
			console.log("Hashgraph: ", drpObject?.hashGraph);
			const nodes: VertexNode[] = [];
			const edges: Edge[] = [];
			if (!drpObject) return;
			for (const vertex of drpObject.hashGraph.vertices.values()) {
				nodes.push({
					id: vertex.hash,
					type: "vertex",
					position: { x: 0, y: 0 },
					data: {
						hash: vertex.hash,
						nodeId: vertex.peerId,
						operation: { type: vertex.operation?.opType ?? "NOP", value: vertex.operation?.value ?? "" },
						deps: vertex.dependencies,
					},
				});

				for (const dep of vertex.dependencies) {
					edges.push({
						id: `${dep}->${vertex.hash}`,
						source: dep,
						target: vertex.hash,
						animated: true,
						markerEnd: {
							type: MarkerType.Arrow,
							width: 25,
							height: 25,
						}
					});
				}
			}
			// get layouted elements
			const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);

			setNodes(layoutedNodes);
			setEdges(layoutedEdges);
		});
	}

	const [drpId, setDrpId] = useState<string>('');

	const handleConnect = async () => {
		
		console.log('Connecting with DRP ID:', drpId);
		drpObject = await node.connectObject({
			id: drpId,
		});
		await createConnectHandlers();
		console.log('Connected with DRP ID:', drpObject);
	};

	const handleDrpIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDrpId(event.target.value);
	};

	return (
		<>
			<ReactFlow
				nodes={nodes}
				nodeTypes={nodeTypes}
				onNodesChange={onNodesChange}
				edges={edges}
				edgeTypes={edgeTypes}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				fitView
				panOnScroll={true}
				zoomOnScroll={false}
				zoomOnPinch={true}
				zoomActivationKeyCode="Meta"
			>
				<Panel position="top-right">
					<button onClick={onLayout}>Reset layout</button>
				</Panel>
				<Background />
				<MiniMap 
					pannable 
					zoomable
				/>
				<Controls />
			</ReactFlow>
			<div className="drp-input">
				<label 
					htmlFor="drpId" 
					className="drp-input__label"
				>
					DRP ID:
				</label>
				<input
					type="text"
					id="drpId"
					value={drpId}
					onChange={handleDrpIdChange}
					placeholder="Enter DRP ID"
					className="drp-input__field"
				/>
				<button
					onClick={handleConnect}
					className="drp-input__button"
					disabled={!drpId}
				>
					Connect
				</button>
			</div>
		</>
	);
}
