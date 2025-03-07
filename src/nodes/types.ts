import { Node } from "@xyflow/react";

export interface Vertex extends Record<string, unknown> {
    hash: string;
    nodeId: string;
    operation: {
        type: string;
        value: string[];
    };
    deps: string[];
    timestamp: number;
    isMatching?: boolean;
}

export type VertexNode = Node<Vertex>;
export type AppNode = VertexNode;
