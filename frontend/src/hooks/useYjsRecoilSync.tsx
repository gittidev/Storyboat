import { useEffect, useRef, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
// import { IndexeddbPersistence } from 'y-indexeddb';
import { nodesState, edgesState } from '../recoil/atoms/storyAtom';
import { PlotNode, PlotEdge, CustomNodeData } from '../types/PlotType';

export const useYjsRecoilSync = (roomId: string) => {
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [edges, setEdges] = useRecoilState(edgesState);
  const doc = useRef<Y.Doc>(new Y.Doc());
  const provider = useRef<WebrtcProvider | null>(null);
  // const indexeddbProvider = useRef<IndexeddbPersistence | null>(null);
  console.log(nodes,edges)
  useEffect(() => {
    // WebRTC 프로바이더 설정
    try {
      provider.current = new WebrtcProvider(roomId, doc.current, {
        signaling: ['ws://localhost:8080/api/signaling'],
      });
      console.log('WebRTC 프로바이더 초기화 성공');

      // WebRTC 연결 상태 모니터링
      provider.current.on('synced', (isSynced) => {
        console.log('WebRTC 동기화 상태 변경:', isSynced);
      });

      // 피어 연결 모니터링
      provider.current.on('peers', (peers) => {
        console.log('연결된 피어 목록:', peers);
      });

      provider.current.on('peers', (change: any) => {
        if (change.action === 'add') {
          console.log('새로운 피어 연결:', change.peer);
        } else if (change.action === 'remove') {
          console.log('피어 연결 해제:', change.peer);
        }
      });

      // 문서 업데이트 모니터링
      // doc.current.on('update', (update: Uint8Array, origin: any) => {
      //   console.log('문서 업데이트 발생:', update, 'Origin:', origin);
      // });

      // Awareness 변경 모니터링
      provider.current.awareness.on('change', () => {
        const states = Array.from(provider.current!.awareness.getStates().entries());
        console.log('Awareness 상태 변경:', states);
      });

      // IndexedDB 영속성 프로바이더 설정
      // indexeddbProvider.current = new IndexeddbPersistence(roomId, doc.current);

      const yNodesArray = doc.current.getArray<PlotNode>('nodes');
      const yEdgesArray = doc.current.getArray<PlotEdge>('edges');

      const syncYjsToRecoil = () => {
        setNodes(yNodesArray.toArray());
        setEdges(yEdgesArray.toArray());
      };

      // Yjs 문서 변경 감지 및 Recoil 상태 업데이트
      yNodesArray.observe(syncYjsToRecoil);
      yEdgesArray.observe(syncYjsToRecoil);

      // IndexedDB 동기화 완료 시 상태 업데이트
      // indexeddbProvider.current.once('synced', () => {
      //   console.log('IndexedDB 동기화 완료');
      //   syncYjsToRecoil();
      // });

      return () => {
        provider.current?.destroy();
        // indexeddbProvider.current?.destroy();
        yNodesArray.unobserve(syncYjsToRecoil);
        yEdgesArray.unobserve(syncYjsToRecoil);
      };
    } catch (error) {
      console.error('WebRTC 프로바이더 초기화 실패:', error);
    }
  }, [roomId, setNodes, setEdges]);

  const updateNode = useCallback(
    (nodeId: string, data: Partial<CustomNodeData>) => {
      const yNodesArray = doc.current.getArray<PlotNode>('nodes');
      doc.current.transact(() => {
        const index = yNodesArray.toArray().findIndex((node) => node.id === nodeId);
        if (index !== -1) {
          const updatedNode = { ...yNodesArray.get(index), ...data };
          yNodesArray.delete(index, 1);
          yNodesArray.insert(index, [updatedNode]);
        }
      });
      console.log(`노드 업데이트: ${nodeId}`);
    },
    []
  );

  const addNode = useCallback((node: PlotNode) => {
    const yNodesArray = doc.current.getArray<PlotNode>('nodes');
    yNodesArray.push([node]);
    console.log(`새 노드 추가: ${node.id}`);
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    const yNodesArray = doc.current.getArray<PlotNode>('nodes');
    doc.current.transact(() => {
      const index = yNodesArray.toArray().findIndex((node) => node.id === nodeId);
      if (index !== -1) {
        yNodesArray.delete(index, 1);
      }
    });
    console.log(`노드 삭제: ${nodeId}`);
  }, []);

  const addEdge = useCallback((edge: PlotEdge) => {
    const yEdgesArray = doc.current.getArray<PlotEdge>('edges');
    yEdgesArray.push([edge]);
    console.log(`새 엣지 추가: ${edge.id}`);
  }, []);

  const deleteEdge = useCallback((edgeId: string) => {
    const yEdgesArray = doc.current.getArray<PlotEdge>('edges');
    doc.current.transact(() => {
      const index = yEdgesArray.toArray().findIndex((edge) => edge.id === edgeId);
      if (index !== -1) {
        yEdgesArray.delete(index, 1);
      }
    });
    console.log(`엣지 삭제: ${edgeId}`);
  }, []);

  return {
    updateNode,
    addNode,
    deleteNode,
    addEdge,
    deleteEdge,
  };
};
