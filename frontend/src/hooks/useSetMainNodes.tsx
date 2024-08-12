// import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
// import { selectedPathState, nodesState, edgesState, mainNodesSelector } from '../recoil/atoms/storyAtom';
// import { isMainNodeModeState } from '../recoil/atoms/storyAtom';
// import { Edge } from '@xyflow/react';

// export const useSetMainNodes = () => {
//     const [nodes, setNodes] = useRecoilState(nodesState);
//     const [edges, setEdges] = useRecoilState(edgesState);
//     const setSelectedPath = useSetRecoilState(selectedPathState);
//     const mainNodes = useRecoilValue(mainNodesSelector);

//     const findPathToRoot = (nodeId: string, edges: Edge[]): string[] => {
//         const path: string[] = [nodeId];
//         let currentId = nodeId;

//         while (true) {
//             const parentEdge = edges.find(edge => edge.target === currentId);
//             if (!parentEdge) break;
//             path.push(parentEdge.source);
//             currentId = parentEdge.source;
//         }

//         return path.reverse();
//     };

//     const setMainNodes = (nodeId: string) => {
//         const pathToRoot = findPathToRoot(nodeId, edges);
//         setSelectedPath(pathToRoot);

//         const updatedNodes = nodes.map(node => ({
//             ...node,
//             data: {
//                 ...node.data,
//                 isMain: pathToRoot.includes(node.id),
//             },
//             style: pathToRoot.includes(node.id) ? { backgroundColor: 'yellow' } : {},
//         }));

//         const updatedEdges = edges.map(edge => ({
//             ...edge,
//             style: pathToRoot.includes(edge.source) && pathToRoot.includes(edge.target) ? { stroke: 'yellow' } : {},
//         }));

//         setNodes(updatedNodes);
//         setEdges(updatedEdges);
//     };

//     return { setMainNodes, mainNodes };
// };
