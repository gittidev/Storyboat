// import {Connection, Edge, MarkerType} from 'reactflow';
// import * as Y from 'yjs';
// // import { CustomNode, CustomEdge } from '../types/PlotType';
// // import { findPathToLeaf } from './nodeUtils';

// export interface CustomEdgeData {
//     // 필요한 경우 여기에 추가 데이터를 정의할 수 있습니다.
// }

// export const onConnect = (
//     params: Connection,
//     ydoc: Y.Doc
// ) => {
//     ydoc.transact(() => {
//         const yEdges = ydoc.getArray('edges');
//         const newEdge: Edge<CustomEdgeData> = {
//             id: `e${params.source}-${params.target}`,
//             source: params.source || '',
//             target: params.target || '',
//             type: 'custom',
//             markerEnd: {type: MarkerType.Arrow},
//         };
//         yEdges.push([newEdge]);
//         console.log('New edge added:', newEdge);
//     });
// };

// export const deleteEdges = (
//     edgesToDelete: CustomEdge[],
//     nodes: CustomNode[],
//     edges: CustomEdge[],
//     ydoc: Y.Doc,
//     setNodes: React.Dispatch<React.SetStateAction<CustomNode[]>>,
//     setEdges: React.Dispatch<React.SetStateAction<CustomEdge[]>>
// ) => {
//     ydoc.transact(() => {
//         const yEdges = ydoc.getArray('edges');
//         const yNodes = ydoc.getArray('nodes');

//         let updatedNodes = [...nodes];

//         edgesToDelete.forEach(edgeToDelete => {
//             const sourceNode = nodes.find(node => node.id === edgeToDelete.source);
//             if (sourceNode && sourceNode.data.isMain) {
//                 const pathToLeaf = findPathToLeaf(edgeToDelete.target, edges);
//                 updatedNodes = updatedNodes.map(node => ({
//                     ...node,
//                     data: {
//                         ...node.data,
//                         isMain: node.data.isMain && !pathToLeaf.includes(node.id)
//                     }
//                 }));
//             }

//             const index = yEdges.toArray().findIndex((edge: any) => edge.id === edgeToDelete.id);
//             if (index !== -1) {
//                 yEdges.delete(index, 1);
//             }
//         });

//         yNodes.delete(0, yNodes.length);
//         yNodes.push(updatedNodes);

//         setNodes(updatedNodes);
//         setEdges(prevEdges => prevEdges.filter(edge => !edgesToDelete.some(e => e.id === edge.id)));
//     });
// };