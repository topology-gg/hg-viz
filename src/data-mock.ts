import { Vertex } from "./nodes/types";

export const rawData: Vertex[] = [
	{
		hash: "hash-1",
		nodeId: "node-1",
		operation: {
			type: "add",
			value: "1",
		},
		deps: [],
	},
	{
		hash: "hash-2",
		nodeId: "node-2",
		operation: {
			type: "add",
			value: "2",
		},
		deps: ["hash-1"],
	},
	{
		hash: "hash-3",
		nodeId: "node-3",
		operation: {
			type: "rm",
			value: "3",
		},
		deps: ["hash-1"],
	},
	{
		hash: "hash-4",
		nodeId: "node-4",
		operation: {
			type: "add",
			value: "4",
		},
		deps: ["hash-2"],
	},
	{
		hash: "hash-5",
		nodeId: "node-5",
		operation: {
			type: "add",
			value: "5",
		},
		deps: ["hash-3", "hash-4"],
	},
];
