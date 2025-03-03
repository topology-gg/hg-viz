import type { Node, BuiltInNode } from "@xyflow/react";

export type Vertex = {
    hash: string;
    nodeId: string;
    operation: {
        type: string;
        value: string[];
    };
    deps: string[];
    timestamp: number;
};
export type VertexNode = Node<Vertex, "vertex">;
export type AppNode = BuiltInNode | VertexNode;
