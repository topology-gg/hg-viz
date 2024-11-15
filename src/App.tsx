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
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import { rawData } from "./data-mock";
import { VertexNode } from "./nodes/types";

export default function App() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const onConnect: OnConnect = useCallback(
		(connection) => setEdges((edges) => addEdge(connection, edges)),
		[setEdges],
	);

	useEffect(() => {
		const ns: VertexNode[] = [];
		const es: Edge[] = [];
		// @jan do ur magic to calculate the position of the nodes
		let count_y = 0;
		for (const v of rawData) {
			count_y += 200;
			ns.push({
				id: v.hash,
				type: "vertex",
				position: { x: 0, y: count_y },
				data: {
					hash: v.hash,
					nodeId: v.nodeId,
					operation: v.operation,
					deps: v.deps,
				},
			});

			for (const dep of v.deps) {
				es.push({
					id: `${dep}->${v.hash}`,
					source: dep,
					target: v.hash,
					animated: true,
				});
			}
		}

		setNodes(ns);
		setEdges(es);
	}, [setNodes, setEdges]);

	return (
		<>
			<input id="search" type="text" placeholder="DRP ID" onChange={() => {}} />
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
				<Background />
				<MiniMap />
				<Controls />
			</ReactFlow>
		</>
	);
}
