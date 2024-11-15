import { Handle, Position, type NodeProps } from "@xyflow/react";

import { type VertexNode } from "./types";

export function VertexNode({ data }: NodeProps<VertexNode>) {
	return (
		// We add this class to use the same styles as React Flow's default nodes.
		<div className="react-flow__node-default">
			<p>Hash: {data.hash}</p>
			<p>Node: {data.nodeId}</p>
			<p>
				Operation: ({data.operation.type}, {data.operation.value})
			</p>
			{data.deps.length > 0 && (
				<Handle type="target" position={Position.Left} />
			)}
			<Handle type="source" position={Position.Right} />
		</div>
	);
}
