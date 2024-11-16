import { Vertex } from "./nodes/types";

/*
	                                           __ V6:ADD(3)
	                                         /
	              ___  V2:ADD(1) <-- V3:RM(2) <-- V7:RM(1) <-- V8:RM(3)
	            /                              ______________/
	  V1:ADD(1)/                              /
	           \                             /
	            \ ___  V4:RM(2) <-- V5:ADD(2) <-- V9:RM(1)
*/

export const testData: Vertex[] = [
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
			value: "1",
		},
		deps: ["hash-1"],
	},
	{
		hash: "hash-3",
		nodeId: "node-3",
		operation: {
			type: "rm",
			value: "2",
		},
		deps: ["hash-2"],
	},
	{
		hash: "hash-4",
		nodeId: "node-4",
		operation: {
			type: "rm",
			value: "2",
		},
		deps: ["hash-1"],
	},
	{
		hash: "hash-5",
		nodeId: "node-5",
		operation: {
			type: "add",
			value: "2",
		},
		deps: ["hash-4"],
	},
	{
		hash: "hash-6",
		nodeId: "node-6",
		operation: {
			type: "add",
			value: "3",
		},
		deps: ["hash-3"],
	},
	{
		hash: "hash-7",
		nodeId: "node-7",
		operation: {
			type: "rm",
			value: "1",
		},
		deps: ["hash-3"],
	},
	{
		hash: "hash-8",
		nodeId: "node-8",
		operation: {
			type: "rm",
			value: "3",
		},
		deps: ["hash-5", "hash-7"],
	},
	{
		hash: "hash-9",
		nodeId: "node-9",
		operation: {
			type: "rm",
			value: "1",
		},
		deps: ["hash-5"],
	},
];