// import * as Y from 'yjs';
// // import { CustomNode, CustomEdge } from '../types/PlotType';

// export const updateNodesFromYjs = (
//     ydoc: Y.Doc,
//     onDeleteNode: (id: string) => void,
//     setNodes: React.Dispatch<React.SetStateAction<CustomNode[]>>,
//     setNextNodeId: React.Dispatch<React.SetStateAction<number>>
// ) => {
//     const yNodes = ydoc.getArray('nodes');
//     const newNodes = yNodes.toArray().map((node: any) => ({
//         ...node,
//         type: 'custom' as const,
//         data: {...node.data, onDelete: onDeleteNode},
//         position: node.position || {x: 0, y: 0},
//     })) as CustomNode[];
//     setNodes(newNodes);
//     setNextNodeId(Math.max(...newNodes.map((node) => parseInt(node.id)), 0) + 1);
// };

// export const updateEdgesFromYjs = (
//     ydoc: Y.Doc,
//     setEdges: React.Dispatch<React.SetStateAction<CustomEdge[]>>
// ) => {
//     const yEdges = ydoc.getArray('edges');
//     const newEdges = yEdges.toArray().map((edge: any) => ({...edge, type: 'custom' as const})) as CustomEdge[];
//     setEdges(newEdges);
// };

// export const setupYjsObservers = (
//     ydoc: Y.Doc,
//     updateNodesFromYjs: () => void,
//     updateEdgesFromYjs: () => void
// ) => {
//     const yNodes = ydoc.getArray('nodes');
//     const yEdges = ydoc.getArray('edges');

//     const nodeObserver = () => {
//         console.log('Nodes updated in Yjs');
//         requestAnimationFrame(updateNodesFromYjs);
//     };

//     const edgeObserver = () => {
//         console.log('Edges updated in Yjs');
//         requestAnimationFrame(updateEdgesFromYjs);
//     };

//     yNodes.observe(nodeObserver);
//     yEdges.observe(edgeObserver);

//     return () => {
//         yNodes.unobserve(nodeObserver);
//         yEdges.unobserve(edgeObserver);
//     };
// };