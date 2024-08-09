// import { useEffect, useRef, useCallback } from 'react';
// import * as Y from 'yjs';
// import { WebsocketProvider } from 'y-websocket';

// export const useYjs = (roomName: string) => {
//     const doc = useRef<Y.Doc>(new Y.Doc());
//     const provider = useRef<WebsocketProvider | null>(null);

//     useEffect(() => {
//         const wsUrl = `ws://${window.location.hostname}:8080`;
//         provider.current = new WebsocketProvider(wsUrl, roomName, doc.current);

//         provider.current.on('status', (event: { status: string }) => {
//             console.log('Connection status:', event.status);
//         });

//         return () => {
//             if (provider.current) {
//                 provider.current.destroy();
//             }
//         };
//     }, [roomName]);

//     const updateNode = useCallback((nodeId: string, data: any) => {
//         const nodesMap = doc.current.getMap('nodes');
//         nodesMap.set(nodeId, data);
//     }, []);

//     const updateEdge = useCallback((edgeId: string, data: any) => {
//         const edgesMap = doc.current.getMap('edges');
//         edgesMap.set(edgeId, data);
//     }, []);

//     return { doc: doc.current, updateNode, updateEdge };
// };