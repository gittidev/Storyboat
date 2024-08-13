import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, Panel } from '@xyflow/react';
import type { Node, XYPosition, ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useParams } from 'react-router-dom';
import { saveFlowToIndexedDB } from '../../utils/indexedDBUtils';
import { myStudioState } from '../../recoil/atoms/studioAtom';
import { accessTokenState } from '../../recoil/atoms/authAtom';
import { useRecoilValue } from 'recoil';
import api from '../../apis/api';
import { useYjsReactFlowSync } from '../../hooks/useYjsReactFlowSync';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import { dummyData } from './dummyStory';
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import { useRecoilState } from 'recoil';
import { isMainNodeModeState } from '../../recoil/atoms/storyAtom';

const flowKey = 'Story';

// OverviewFlow 외부
const createNodeTypes = (handleDeleteNode:any, handleUpdateNodeField: (id: string, field: string, value: any) => void) => ({
  custom: (props: any) => (
    <CustomNode
      {...props}
      id={props.id}
      data={props.data}
      deleteNode={handleDeleteNode}
      updateNodeField={ handleUpdateNodeField}  
    />
  ),
});

const createEdgeTypes = (handleDeleteEdge: any) => ({
  custom: (props: any) => (
    <CustomEdge
      {...props}
      deleteEdge={handleDeleteEdge}
    />
  ),
});

const StyledButton = styled(Button)`
  margin: 0px 2px;
  padding: 2px;
  background-color: ${(props) => {
    switch (props.className) {
      case 'primary':
        return '#4ee956'; // 기본 색상
      case 'secondary':
        return '#ff6a7b'; // 다른 색상
      case 'third':
        return '#6a9cff'; // 또 다른 색상
      case 'tertiary':
        return '#8f8fff'; // 또 다른 색상
      default:
        return '#c5ffbd'; // 기본 색상
    }
  }};
  color: white;
`;

const OverviewFlow: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const roomId = storyId || `default_room_${Date.now()}`;

  const [isMainNodeMode, setIsMainNodeMode] = useRecoilState(isMainNodeModeState);

  const studioId = useRecoilValue(myStudioState)
  const token = useRecoilValue(accessTokenState)

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    addNode,
    onEdgesChange,
    onConnect,
    deleteNode,
    deleteEdge,
    onNodeDragStop,
    onDrop,
    updateNodeField,
    setViewport,
    yNodesMapRef,
    yEdgesMapRef,
    ydocRef,
    users,
    providerRef,  
  } = useYjsReactFlowSync(roomId);


  //초기 렌더링시 불러온 데이터(가장 마지막 작업)//AP
  const loadDummyData = useCallback(() => {
    const { nodes: dummyNodes, edges: dummyEdges, viewport } = dummyData.flowData;

    setNodes(dummyNodes);
    setEdges(dummyEdges);

    if (rfInstance) {
      rfInstance.setNodes(dummyNodes);
      rfInstance.setEdges(dummyEdges);
      rfInstance.setViewport(viewport);
    }
  }, [rfInstance, setNodes, setEdges, setViewport]);




  useEffect(() => {
    loadDummyData();
  }, [loadDummyData]);













  //전체 영역 노드 삭제
  const deleteAllNodes = useCallback(() => {
    ydocRef.current?.transact(() => {
      yNodesMapRef.current?.clear();
      yEdgesMapRef.current?.clear();
    });

    setNodes([]);
    setEdges([]);

    if (rfInstance) {
      rfInstance.setNodes([]);
      rfInstance.setEdges([]);
    }
  }, [rfInstance, setNodes, setEdges, ydocRef, yNodesMapRef, yEdgesMapRef]);

  //노드 삭제
  const handleDeleteNode = useCallback(
    (id: string) => {
      deleteNode(id);
    },
    [deleteNode]
  );

//엣지 삭제
  const handleDeleteEdge = useCallback(
    (id: string) => {
      deleteEdge(id);
      // setEdges((es) => es.filter((e) => e.id !== id));
    },
    [deleteEdge, setEdges]
  );

  //노드 내부 영역 수정
  const handleUpdateNodeField = useCallback((id: string, field: string, value: any) => {
    updateNodeField(id, field, value);  // Yjs 상태에 실시간 반영
  }, [updateNodeField]);

//메모이제이션 타입 추가
  const nodeTypes = useMemo(() => createNodeTypes(handleDeleteNode,  handleUpdateNodeField), [handleDeleteNode,  handleUpdateNodeField]);
  const edgeTypes = useMemo(() => createEdgeTypes(handleDeleteEdge), [handleDeleteEdge]);

  //노드 추가
  const addCustomNode = useCallback(() => {
    const position: XYPosition = { x: Math.random() * 500, y: Math.random() * 500 };
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: 'custom',
      position,
      data: {
        label: `플롯`,
        content: '플롯 작성',
        text: '소설 작성',
      },
    };
    addNode(newNode);
  }, [addNode]);

//indexedDB에 임시저장
  const onTemporarySave = useCallback(async () => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      await saveFlowToIndexedDB(flowKey, flow);
    }
  }, [rfInstance]);

  const handleSave = useCallback(async () => {
    if (rfInstance) {
      const flowData = rfInstance.toObject();
      const timestamp = new Date().toISOString();

      const storyData = {
        storyNumber: storyId || '',
        timestamp: timestamp,
        flowData: flowData,
      };

      try {
        const response = await api.put(`/api/studios/${studioId}/stories/${storyId}`, storyData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response) {
          console.log('Story 저장 완료');
          console.log(storyData)
        } else {
          console.error('Failed to save story');
        }
      } catch (error) {
        console.error('Error saving story:', error);
      }
    }
  }, [storyId, studioId, token, rfInstance]);


  // 페이지 벗어날 시 WebRTC 연결 해제
  useEffect(() => {
    const handlePageHide = (event: PageTransitionEvent) => {
        if (!event.persisted) {
            if (ydocRef.current) {
                ydocRef.current.destroy();
                ydocRef.current = null;
            }
        }
    };

    window.addEventListener('pagehide', handlePageHide);

    return () => {
        if (providerRef.current) {
            providerRef.current.destroy();
            providerRef.current = null;
        }
        if (ydocRef.current) {
            ydocRef.current.destroy();
            ydocRef.current = null;
        }
        window.removeEventListener('pagehide', handlePageHide);
    };
  }, [providerRef, ydocRef]);



  // 메인 노드 모드 토글 핸들러
  const toggleMainNodeMode = useCallback(() => {
    setIsMainNodeMode((prev) => !prev);
  }, [setIsMainNodeMode]);


  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={setRfInstance}
      >
        <Background />
        <Controls />
        <MiniMap nodeStrokeColor={"transparent"} nodeColor={"#e2e2e2"} maskStrokeColor={"none"} pannable zoomable nodeStrokeWidth={3} maskColor={"rgb(240, 240, 240, 0.6)"} />

        <Panel position="top-right" style={{display:'flex', justifyContent: 'space-between', width:'95%'}}>
        <div>
        </div>
        <div>
          <StyledButton className="primary" onClick={handleSave}>저장하기</StyledButton>
          <StyledButton className="third" onClick={onTemporarySave}>임시저장</StyledButton>
          <StyledButton className="tertiary" onClick={addCustomNode}>플롯추가</StyledButton>
          <StyledButton className="secondary" onClick={deleteAllNodes}>전체삭제</StyledButton>

          <StyledButton
              variant="contained"
              color={isMainNodeMode ? "success" : "primary"}
              onClick={toggleMainNodeMode}
            >
              {isMainNodeMode ? "메인 노드 선택 모드 켜짐" : "메인 노드 선택 모드 꺼짐"}
            </StyledButton>

          <div className="user-list">
          {users.map((user) => (
            <div key={user.clientId} className="user-list-item" style={{ color: user.cursorColor }}>
              {user.name} - {user.clientId}
              
            </div>
          ))}
        </div>
        </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default OverviewFlow;
