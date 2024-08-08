// import { Edge } from 'reactflow';
// import * as Y from 'yjs';
// import { PlotNode, CustomEdge } from '../types/PlotType';

// export const findPathToRoot = (nodeId: string, edges: Edge[]): string[] => {
//     const path: string[] = [];
//     const visited = new Set<string>();
//     const findPath = (currentId: string) => {
//         if (visited.has(currentId)) return;
//         visited.add(currentId);
//         path.push(currentId);
//         const parentEdge = edges.find((e) => e.target === currentId);
//         if (parentEdge) {
//             findPath(parentEdge.source);
//         }
//     };
//     findPath(nodeId);
//     return path.reverse();
// };

// export const findPathToLeaf = (nodeId: string, edges: Edge[]): string[] => {
//     const path: string[] = [nodeId];
//     const visited = new Set<string>();
//     const findPath = (currentId: string) => {
//         if (visited.has(currentId)) return;
//         visited.add(currentId);
//         const childEdges = edges.filter((e) => e.source === currentId);
//         childEdges.forEach((edge) => {
//             path.push(edge.target);
//             findPath(edge.target);
//         });
//     };
//     findPath(nodeId);
//     return path;
// };

// export const setMainNodes = (
//     nodeId: string,
//     nodes: CustomNode[],
//     edges: CustomEdge[],
//     ydoc: Y.Doc,
//     setNodes: React.Dispatch<React.SetStateAction<CustomNode[]>>
// ) => {
//     const pathToRoot = findPathToRoot(nodeId, edges);

//     ydoc.transact(() => {
//         const yNodes = ydoc.getArray('nodes');
//         const updatedNodes = nodes.map((node) => ({
//             ...node,
//             data: {
//                 ...node.data,
//                 isMain: pathToRoot.includes(node.id)
//             }
//         }));
//         yNodes.delete(0, yNodes.length);
//         yNodes.push(updatedNodes);
//     });

//     setNodes(prevNodes => {
//         const updatedNodes = prevNodes.filter(node => node.id !== nodeId);
//         setMainNodes(updatedNodes[0]?.id || '', updatedNodes, edges, ydoc, setNodes);
//         return updatedNodes;
//     });
// };

// export const onDeleteNode = (
//     id: string,
//     nodes: CustomNode[],
//     edges: CustomEdge[],
//     ydoc: Y.Doc,
//     setNodes: React.Dispatch<React.SetStateAction<CustomNode[]>>,
//     setEdges: React.Dispatch<React.SetStateAction<CustomEdge[]>>
// ) => {
//     const nodeToDelete = nodes.find(node => node.id === id);
//     if (!nodeToDelete) return;

//     ydoc.transact(() => {
//         const yNodes = ydoc.getArray('nodes');
//         const yEdges = ydoc.getArray('edges');

//         let updatedNodes = nodes.filter(node => node.id !== id);

//         if (nodeToDelete.data.isMain) {
//             const pathToLeaf = findPathToLeaf(id, edges);
//             updatedNodes = updatedNodes.map(node => ({
//                 ...node,
//                 data: {
//                     ...node.data,
//                     isMain: node.data.isMain && !pathToLeaf.includes(node.id)
//                 }
//             }));
//         }

//         yNodes.delete(0, yNodes.length);
//         yNodes.push(updatedNodes);

//         const edgesToDelete = edges.filter(
//             (edge) => edge.source === id || edge.target === id
//         );
//         edgesToDelete.forEach((edge) => {
//             const edgeIndex = yEdges.toArray().findIndex((e: any) => e.id === edge.id);
//             if (edgeIndex !== -1) {
//                 yEdges.delete(edgeIndex, 1);
//             }
//         });

//         setNodes(updatedNodes);
//         setEdges(edges.filter(edge => edge.source !== id && edge.target !== id));
//     });
// };