import type { NodeTypes } from '@xyflow/react';
import { VertexNode } from './VertexNode';
import { AppNode } from './types';

export const initialNodes: AppNode[] = [];
export const nodeTypes = {
	'vertex': VertexNode,
} satisfies NodeTypes;
