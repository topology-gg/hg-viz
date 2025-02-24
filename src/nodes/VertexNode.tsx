import { Handle, Position, type NodeProps } from "@xyflow/react";

import { type VertexNode } from "./types";

export function VertexNode({ data }: NodeProps<VertexNode>) {
	return (
		// We add this class to use the same styles as React Flow's default nodes.
		<div className="react-flow__node-default">
			<div className="vertex-node">
				<div className="vertex-node__hash">Hash: {data.hash}</div>
				<div className="vertex-node__id">Node: {data.nodeId}</div>
				<div className="vertex-node__operation">
					Operation: {data.operation.type}
					{data.operation.value && `, ${data.operation.value}`}
				</div>
			</div>
			{data.deps.length > 0 && (
				<Handle type="target" position={Position.Bottom} />
			)}
			<Handle type="source" position={Position.Top} />
		</div>
	);
}
