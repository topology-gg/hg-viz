import { useCallback, useState, useEffect } from "react";
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

let dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

interface DRPVertex {
	hash: string;
	peerId: string;
	operation?: {
		opType: string;
		value: string[];
	};
	dependencies: string[];
	timestamp: number;
}

const nodeWidth = 200;
const nodeHeight = 200;

const node = new DRPNode();
await node.start();
let drpObject: DRPObject | undefined = undefined;

const getLayoutedElements = (nodes: AppNode[], edges: Edge[]) => {
	dagreGraph.setGraph({ rankdir: "LR" });

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
	const [searchQuery, setSearchQuery] = useState("");

	const onConnect: OnConnect = useCallback(
		(connection) => setEdges((edges) => addEdge(connection, edges)),
		[setEdges],
	);

	const onLayout = () => {
		const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
		setNodes(layoutedNodes);
		setEdges(layoutedEdges);
	};

	const isVertexMatchingSearch = useCallback((vertex: DRPVertex, searchLower: string) => {
		if (!vertex.operation?.value || !searchLower) return false;

		return (
			vertex.peerId.toLowerCase().includes(searchLower) ||
			vertex.operation.opType.toLowerCase().includes(searchLower) ||
			vertex.operation.value.some((v: string) => v.toLowerCase().includes(searchLower)) ||
			vertex.hash.toLowerCase().includes(searchLower)
		);
	}, []);

	const createNodeFromVertex = useCallback((vertex: DRPVertex, isMatching: boolean): VertexNode => {
		return {
			id: vertex.hash,
			type: "vertex",
			position: { x: 0, y: 0 },
			data: {
				hash: vertex.hash,
				nodeId: vertex.peerId,
				operation: {
					type: vertex.operation?.opType ?? "NOP",
					value: vertex.operation?.value ?? [],
				},
				deps: vertex.dependencies,
				timestamp: vertex.timestamp,
				isMatching,
			},
		};
	}, []);

	const createEdgesFromDependencies = useCallback(
		(vertex: DRPVertex, filteredVertices: DRPVertex[]) => {
			const edges: Edge[] = [];

			for (const dep of vertex.dependencies) {
				if (filteredVertices.some(v => v.hash === dep)) {
					edges.push({
						id: `${dep}->${vertex.hash}`,
						source: dep,
						target: vertex.hash,
						animated: true,
						markerEnd: {
							type: MarkerType.Arrow,
							width: 25,
							height: 25,
						},
					});
				}
			}

			return edges;
		},
		[]
	);

	const updateNodesAndEdges = useCallback(() => {
		if (!drpObject?.hashGraph) return;

		const nodes: VertexNode[] = [];
		const edges: Edge[] = [];
		const searchLower = searchQuery.toLowerCase();

		// Filter vertices based on universal search
		const filteredVertices = Array.from(drpObject.hashGraph.vertices.values());

		for (const vertex of filteredVertices) {
			const isMatching = isVertexMatchingSearch(vertex, searchLower);

			nodes.push(createNodeFromVertex(vertex, isMatching));

			edges.push(...createEdgesFromDependencies(vertex, filteredVertices));
		}

		const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
		setNodes(layoutedNodes);
		setEdges(layoutedEdges);
	}, [
		searchQuery,
		setNodes,
		setEdges,
		isVertexMatchingSearch,
		createNodeFromVertex,
		createEdgesFromDependencies,
	]);

	// Update nodes when search query changes
	useEffect(() => {
		updateNodesAndEdges();
	}, [searchQuery, updateNodesAndEdges]);

	async function createConnectHandlers() {
		if (!drpObject) return;
	
		node.addCustomGroupMessageHandler(drpObject?.id, () => {});
	
		node.objectStore.subscribe(drpObject?.id, () => {
			console.log('Object updated');
			console.log("Hashgraph: ", drpObject?.hashGraph);
			updateNodesAndEdges();
		});
	}

	const [drpId, setDrpId] = useState<string>('');

	const handleConnect = async () => {
		dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
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
				zoomOnPinch={true}
				zoomActivationKeyCode="Meta"
			>
				<Panel position="top-right">
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "8px",
							background: "white",
							padding: "12px",
							borderRadius: "8px",
							boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
						}}
					>
						<button onClick={onLayout}>Reset layout</button>
						<input
							type="text"
							placeholder="Search nodes (peer, operation, hash...)"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							style={{ 
								padding: '8px',
								borderRadius: '4px',
								border: '1px solid #ccc',
								width: '250px',
								fontSize: '14px'
							}}
						/>
					</div>
				</Panel>
				<Background />
				<MiniMap 
					pannable 
					zoomable
					nodeColor={node => {
						const data = node.data as VertexNode['data'];
						return data.isMatching ? '#ffd700' : '#ddd';
					}}
					nodeStrokeWidth={10}
				/>
				<Controls />
			</ReactFlow>
			<div className="drp-input">
				<label htmlFor="drpId" className="drp-input__label">
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
				<button onClick={handleConnect} className="drp-input__button" disabled={!drpId}>
					Connect
				</button>
			</div>
		</>
	);
}
