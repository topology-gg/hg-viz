import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useState, useCallback } from "react";

import { type VertexNode } from "./types";
import { getColorForPeerId } from "../util/color";

export function VertexNode({ data }: NodeProps<VertexNode>) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [notification, setNotification] = useState("");

	const showNotification = useCallback((message: string) => {
		setNotification(message);
		setTimeout(() => setNotification(""), 2000);
	}, []);

	const glowStyle = data.isMatching ? {
		boxShadow: '0 0 20px #ffd700',
		animation: 'glow 1.5s ease-in-out infinite alternate'
	} : {};

	return (
		<div 
			className="react-flow__node-default" 
			style={{ 
				border: `10px solid ${getColorForPeerId(data.nodeId)}`,
				borderRadius: "20px",
				transition: "all 0.3s ease-in-out",
				cursor: "pointer",
				...glowStyle
			}}
			onClick={() => setIsExpanded(!isExpanded)}
		>
			<style>
				{`
					@keyframes glow {
						from {
							box-shadow: 0 0 10px #ffd700;
						}
						to {
							box-shadow: 0 0 20px #ffd700, 0 0 30px #ffd700;
						}
					}
				`}
			</style>
			<div className="vertex-node">
				<div className="vertex-node__id">
					<strong style={{color: `${getColorForPeerId(data.nodeId)}`}}>Node:</strong> <br />
					{`${data.nodeId.slice(0,4)}...${data.nodeId.slice(-4)}`}
					<button 
						onClick={(e) => {
							e.stopPropagation();
							navigator.clipboard.writeText(data.nodeId);
							showNotification("Node ID copied!");
						}}
						style={{ 
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							padding: '0 4px',
							outline: 'none',
							boxShadow: 'none'
						}}
						className="copy-button"
					>
						📋
					</button>
				</div>
				<div className="vertex-node__hash">
					<strong>Hash:</strong> <br />
					{`${data.hash.slice(0,4)}...${data.hash.slice(-4)}`}
					<button
						onClick={(e) => {
							e.stopPropagation();
							navigator.clipboard.writeText(data.hash);
							showNotification("Hash copied!");
						}}
						style={{ 
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							padding: '0 4px',
							outline: 'none',
							boxShadow: 'none'
						}}
					>
						📋
					</button>
				</div>
				<div className="vertex-node__timestamp">
					<strong>Timestamp:</strong> {data.timestamp}
				</div>
				{isExpanded && data.deps.length > 0 && (
					<div className="vertex-node__expanded">
						<div className="vertex-node__operation">
							<strong>Type:</strong> {data.operation.type} <br />
							<strong>Value:</strong> <br />
							{data.operation.value.map((v, i) => (
								<div key={i}>{v.length > 10 ? `${v.slice(0, 4)}...${v.slice(-4)}` : v}{i < data.operation.value.length - 1 && ","}</div>
							))}
						</div>
						<div className="vertex-node__deps">
							<strong style={{fontSize: "10px"}}>Dependencies:</strong>
							<ul style={{ 
								listStyle: "none", 
								padding: "1px",
								margin: 0,
								fontSize: "10px",
								maxHeight: "100px",
							}}>
								{data.deps.map((dep) => (
									<li key={dep}>{`${dep.slice(0,4)}...${dep.slice(-4)}`}</li>
								))}
							</ul>
						</div>
					</div>
				)}
			</div>
			{notification && (
				<div
					style={{
						position: "absolute",
						bottom: "-40px",
						left: "50%",
						transform: "translateX(-50%)",
						background: "rgba(0,0,0,0.8)",
						color: "white",
						padding: "4px 12px",
						borderRadius: "4px",
						fontSize: "12px",
						animation: "slideUp 0.3s ease-out",
						zIndex: 1000,
					}}
				>
					{notification}
				</div>
			)}
			{data.deps.length > 0 && (
				<Handle type="target" position={Position.Left} />
			)}
			<Handle type="source" position={Position.Right} />
		</div>
	);
}
