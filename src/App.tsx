import { useCallback, useEffect } from "react";

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
import { testData } from "./data-mock";
import { VertexNode } from "./nodes/types";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 100;

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
	const onConnect: OnConnect = useCallback(
		(connection) => setEdges((edges) => addEdge(connection, edges)),
		[setEdges],
	);

	const onLayout = useCallback(() => {
		const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
		setNodes(layoutedNodes);
		setEdges(layoutedEdges);
	}, [nodes, edges]);

	useEffect(() => {
		const nodes: VertexNode[] = [];
		const edges: Edge[] = [];
		for (const v of testData) {
			nodes.push({
				id: v.hash,
				type: "vertex",
				position: { x: 0, y: 0 },
				data: {
					hash: v.hash,
					nodeId: v.nodeId,
					operation: v.operation,
					deps: v.deps,
				},
			});

			for (const dep of v.deps) {
				edges.push({
					id: `${dep}->${v.hash}`,
					source: dep,
					target: v.hash,
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
	}, [setNodes, setEdges]);

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
			>
				<Panel position="top-right">
					<button onClick={onLayout}>Reset layout</button>
				</Panel>
				<Background />
				<MiniMap />
				<Controls />
			</ReactFlow>
		</>
	);
}
