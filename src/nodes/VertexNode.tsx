import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useState } from "react";

import { type VertexNode } from "./types";
import { getColorForPeerId } from "../util/color";

export function VertexNode({ data }: NodeProps<VertexNode>) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		// We add this class to use the same styles as React Flow's default nodes.
		<div 
			className="react-flow__node-default" 
			style={{ 
				border: `10px solid ${getColorForPeerId(data.nodeId)}`,
				transition: "border 1s ease-in-out",
				cursor: "pointer",
				minWidth: isExpanded ? "300px" : "auto"
			}}
			onClick={() => setIsExpanded(!isExpanded)}
		>
			<div className="vertex-node">
				<div className="vertex-node__hash">
					<strong>Hash:</strong> {isExpanded ? data.hash : `${data.hash.slice(0,4)}...${data.hash.slice(-4)}`}
				</div>
				<div className="vertex-node__id">
					<strong>Node:</strong> {isExpanded ? data.nodeId : `${data.nodeId.slice(0,4)}...${data.nodeId.slice(-4)}`}
				</div>
				<div className="vertex-node__operation">
					<strong>Operation:</strong> {data.operation.type}
					{data.operation.value && `, ${data.operation.value}`}
				</div>
				{isExpanded && (
					<div className="vertex-node__deps">
						<strong>Dependencies:</strong>
						<ul style={{ 
							listStyle: "none", 
							padding: "5px",
							margin: 0,
							fontSize: "12px",
							maxHeight: "100px",
							overflowY: "auto"
						}}>
							{data.deps.map((dep) => (
								<li key={dep}>{dep}</li>
							))}
						</ul>
					</div>
				)}
			</div>
			{data.deps.length > 0 && (
				<Handle type="target" position={Position.Bottom} />
			)}
			<Handle type="source" position={Position.Top} />
		</div>
	);
}
