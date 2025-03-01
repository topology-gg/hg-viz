import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useState } from "react";

import { type VertexNode } from "./types";
import { getColorForPeerId } from "../util/color";

export function VertexNode({ data }: NodeProps<VertexNode>) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div 
			className="react-flow__node-default" 
			style={{ 
				border: `10px solid ${getColorForPeerId(data.nodeId)}`,
				transition: "border 1s ease-in-out",
				cursor: "pointer",
			}}
			onClick={() => setIsExpanded(!isExpanded)}
		>
			<div className="vertex-node">
				<div className="vertex-node__hash">
					<strong>Hash:</strong> {`${data.hash.slice(0,4)}...${data.hash.slice(-4)}`}
				</div>
				<div className="vertex-node__id">
					<strong>Node:</strong> {`${data.nodeId.slice(0,4)}...${data.nodeId.slice(-4)}`}
				</div>
				<div className="vertex-node__operation">
					<strong>Type:</strong> {data.operation.type} <br />
					<strong>Value:</strong> <br />
					{data.operation.value.map((v, i) => (
						<div key={i}>{v.length > 10 ? `${v.slice(0, 4)}...${v.slice(-4)}` : v}{i < data.operation.value.length - 1 && ","}</div>
					))}
				</div>
				<div className="vertex-node__timestamp">
					<strong>Timestamp:</strong> {data.timestamp}
				</div>
				{isExpanded && data.deps.length > 0 && (
					<div className="vertex-node__deps">
						<strong>Dependencies:</strong>
						<ul style={{ 
							listStyle: "none", 
							padding: "5px",
							margin: 0,
							fontSize: "12px",
							maxHeight: "100px",
						}}>
							{data.deps.map((dep) => (
								<li key={dep}>{`${dep.slice(0,4)}...${dep.slice(-4)}`}</li>
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
